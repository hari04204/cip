from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS # Import CORS

app = Flask(__name__)

# --- CORS Configuration ---
# Allows requests ONLY to the /estimate route
# coming ONLY from your React app's origin (http://localhost:5173)
# This specifically addresses the CORS error you encountered.
cors = CORS(app, resources={r"/estimate": {"origins": "http://localhost:5173"}})

# --- Configuration and Multiplier Maps ---
TECH_STACK_MAP = {
    'MERN': 1.0, 'MEAN': 1.1, 'Spring Boot': 1.2, 'Django': 0.95, 'Flutter': 1.1, 'Blockchain': 1.5,
    'React Native': 1.05, 'ASP.NET': 1.0, 'Node': 1.1, 'Ruby on Rails': 1.15
}
LOCATION_MAP = {
    # Assuming (Cost Index, Location Multiplier) format
    'India Tier 2': (40, 0.5), 'India Tier 1': (50, 0.7), 'Eastern Europe': (70, 0.8),
    'Western Europe': (100, 1.2), 'US': (120, 1.4), 'Canada': (100, 1.3),
    'Australia': (95, 1.25), 'Southeast Asia': (60, 0.6)
}
PRODUCT_COMPLEXITY_MAP = {
    'Low': 0.9, 'Moderate': 1.0, 'High': 1.2, 'Very High': 1.4
}

# --- Load Models ---
try:
    # Use raw strings (r"...") or forward slashes for paths
    # IMPORTANT: Replace with your actual file paths
    duration_model_path = r"C:\Users\reach\CODE\cipapp\backend\duration_model_tuned.pkl"
    effort_model_path = r"C:\Users\reach\CODE\cipapp\backend\xgboost.pkl"

    print(f"Loading duration model from: {duration_model_path}")
    with open(duration_model_path, "rb") as f:
        duration_model = pickle.load(f)

    print(f"Loading effort model from: {effort_model_path}")
    with open(effort_model_path, "rb") as f:
        effort_model = pickle.load(f)

    print("Models loaded successfully.")
except FileNotFoundError as e:
    print(f"FATAL ERROR loading model: {e}. Please check the file path.")
    # In a real app, you might want to handle this more gracefully
    # For now, we exit if models can't be loaded.
    exit()
except Exception as e:
    print(f"FATAL ERROR: An unexpected error occurred during model loading: {e}")
    exit()

# --- Define Trained Feature Order ---
# **IMPORTANT**: These orders MUST exactly match how your models were trained

# Based on your Flask snippet for duration_input
duration_feature_order = [
    'Team size', 'Dedicated team members', 'Degree of risk management',
    'Economic instability impact', 'Reliability requirements', 'Schedule quality',
    'Software tool experience', 'Organization management structure clarity',
    'Team cohesion', 'Development type', 'Application domain'
]

# Based on your second script's trained_features list for xgboost.pkl
effort_feature_order = [
    'Dedicated team members', 'Team size', 'Actual duration', 'Object points',
    'Degree of risk management', 'Economic instability impact', 'Development type',
    'Other sizing method', 'Application domain', 'Top management opinion of previous system',
    'Development environment adequacy', '# Multiple programing languages ', # Note space and typo
    'User resistance', 'Reliability requirements', 'Income satisfaction', 'Schedule quality',
    'Software tool experience', 'Comments within the code',
    'Organization management structure clarity', 'Team cohesion'
]

# --- API Endpoint ---
@app.route('/estimate', methods=['POST', 'OPTIONS']) # Added OPTIONS to explicitly handle preflight requests if needed, although Flask-CORS usually handles it
def estimate():
    # Flask-CORS typically handles OPTIONS requests automatically.
    # If it's a POST request, proceed with estimation.
    if request.method == 'OPTIONS':
        # Preflight request response is handled by Flask-CORS
        return {}

    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No input data provided"}), 400
            print("Received data:", data) # Log received data for debugging

            # --- Prepare Input for Duration Model ---
            if not all(key in data for key in duration_feature_order):
                missing_keys = [key for key in duration_feature_order if key not in data]
                print(f"Error: Missing keys for duration prediction: {missing_keys}") # Log error
                return jsonify({"error": f"Missing keys for duration prediction: {missing_keys}"}), 400
            duration_input = [data[key] for key in duration_feature_order]

            # --- Predict Duration ---
            print("Duration Input:", duration_input) # Log input
            predicted_duration = duration_model.predict(np.array([duration_input]))[0]
            predicted_duration = max(0, float(predicted_duration)) # Ensure non-negative float
            print("Predicted Duration:", predicted_duration) # Log result


            # --- Prepare Input for Effort Model ---
            effort_input_values = data.copy()
            effort_input_values['Actual duration'] = predicted_duration # Use predicted duration

            # Check required keys for effort model (all except 'Actual duration')
            required_effort_keys_from_data = [f for f in effort_feature_order if f != 'Actual duration']
            if not all(key in effort_input_values for key in required_effort_keys_from_data):
                missing_keys = [key for key in required_effort_keys_from_data if key not in effort_input_values]
                print(f"Error: Missing keys for effort prediction: {missing_keys}") # Log error
                return jsonify({"error": f"Missing keys for effort prediction: {missing_keys}"}), 400

            # Create input list in the exact order the model expects
            effort_input = [effort_input_values[key] for key in effort_feature_order]

            # --- Predict Effort ---
            print("Effort Input:", effort_input) # Log input
            predicted_effort = effort_model.predict(np.array([effort_input]))[0]
            predicted_effort = max(0, float(predicted_effort)) # Ensure non-negative float
            print("Predicted Effort:", predicted_effort) # Log result


            # --- Extract data for Cost Calculation ---
            required_cost_keys = [
                'Juniors', 'Mid', 'Seniors', 'Team size', # Team composition
                'Location', 'Tech-stack', 'Complexity level', # Keys for multiplier lookup
                'Hourly Rate', 'Overhead', 'Additional costs' # Direct cost parameters
            ]
            if not all(key in data for key in required_cost_keys):
                missing_keys = [key for key in required_cost_keys if key not in data]
                print(f"Error: Missing keys for cost calculation: {missing_keys}") # Log error
                return jsonify({"error": f"Missing keys for cost calculation: {missing_keys}"}), 400

            num_juniors = int(data['Juniors'])
            num_mid = int(data['Mid'])
            num_seniors = int(data['Seniors'])
            team_size = int(data['Team size'])

            # --- Calculate Team Multiplier ---
            if team_size <= 0:
                print("Error: Team size must be greater than zero") # Log error
                return jsonify({"error": "Team size must be greater than zero"}), 400

            team_efficiency = ((num_juniors * 0.7) + (num_mid * 1.0) + (num_seniors * 1.3)) / team_size
            if team_efficiency <= 0:
                team_multiplier = 1.0 # Assign a default or handle as error
                print("Warning: Team efficiency calculated as non-positive. Using default multiplier 1.0.")
            else:
                team_multiplier = 1 / team_efficiency
            print(f"Team Efficiency: {team_efficiency}, Team Multiplier: {team_multiplier}") # Log calculation


            # --- Get Other Multipliers from Maps ---
            tech_stack = data['Tech-stack']
            location = data['Location']
            complexity_level = data['Complexity level']

            tech_multiplier = TECH_STACK_MAP.get(tech_stack, 1.0)
            _, location_multiplier = LOCATION_MAP.get(location, (0, 1.0)) # Default multiplier to 1.0
            complexity_factor = PRODUCT_COMPLEXITY_MAP.get(complexity_level, 1.0)
            print(f"Multipliers - Tech: {tech_multiplier}, Location: {location_multiplier}, Complexity: {complexity_factor}") # Log multipliers


            # --- Get Cost Parameters ---
            cost_per_hour = float(data['Hourly Rate'])
            overhead_cost = float(data['Overhead'])
            additional_cost = float(data['Additional costs'])

            # --- Calculate Total Cost ---
            adjusted_effort = predicted_effort * team_multiplier
            total_cost = (adjusted_effort * cost_per_hour * tech_multiplier *
                          location_multiplier * complexity_factor) + overhead_cost + additional_cost
            print(f"Adjusted Effort: {adjusted_effort}, Total Cost: {total_cost}") # Log cost calculation


            # --- Return Results ---
            response_data = {
                'predicted_duration_months': round(predicted_duration, 2),
                'predicted_effort_hours': round(predicted_effort, 2),
                'adjusted_effort_hours': round(adjusted_effort, 2),
                'team_multiplier': round(team_multiplier, 3),
                'total_project_cost': round(total_cost, 2)
            }
            print("Sending Response:", response_data) # Log response
            return jsonify(response_data)

        except KeyError as e:
            print(f"Error: Missing required input data key: {str(e)}") # Log error
            return jsonify({"error": f"Missing required input data key: {str(e)}"}), 400
        except ValueError as e:
            print(f"Error: Invalid data type for input: {str(e)}") # Log error
            return jsonify({"error": f"Invalid data type or value for input: {str(e)}"}), 400
        except Exception as e:
            # Catch-all for other unexpected errors
            # Log the full traceback for detailed debugging
            import traceback
            print(f"FATAL ERROR: An unexpected error occurred in /estimate: {e}")
            traceback.print_exc() # Print detailed traceback to Flask console
            return jsonify({"error": "An internal server error occurred. Please check server logs."}), 500

# --- Run the App ---
if __name__ == '__main__':
    # Host='0.0.0.0' makes it accessible on your network
    # Debug=True enables auto-reloading and provides detailed errors (disable in production)
    print("Starting Flask app...")
    app.run(debug=True)
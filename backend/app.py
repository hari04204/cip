from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
@app.route('/estimate', methods=['POST'])
def estimate_cost():
    data = request.get_json()

    try:
        team_size = float(data.get('teamSize', 0))
        actual_duration = float(data.get('actualDuration', 0))
        object_points = float(data.get('objectPoints', 0))
        hourly_rate = float(data.get('hourlyRate', 0))
        overhead_cost = float(data.get('overheadCost', 0))
        additional_cost = float(data.get('additionalCost', 0))
        number_of_languages = int(data.get('numberOfLanguages', 1))

        risk_management = data.get('riskManagement', 'Medium')
        economic_instability = data.get('economicInstability', 'Medium')
        reliability_requirements = data.get('reliabilityRequirements', 'Normal')
        tool_experience = data.get('toolExperience', 'Adequate')
        team_level = data.get('teamLevel', 'Mid')
        product_complexity = data.get('productComplexity', 'Moderate')
        location = data.get('location', 'India Tier 2')

        # Dummy multipliers (adjust these with real values in your final model)
        risk_factor = {'Low': 0.9, 'Medium': 1.0, 'High': 1.2}.get(risk_management, 1.0)
        complexity_factor = {'Low': 0.9, 'Moderate': 1.0, 'High': 1.3}.get(product_complexity, 1.0)
        experience_factor = {'Few': 1.1, 'Adequate': 1.0, 'Extensive': 0.95}.get(tool_experience, 1.0)
        location_multiplier = {'India Tier 2': 0.8, 'US Tier 1': 1.5, 'Remote': 1.2}.get(location, 1.0)

        # Estimate effort in hours (this is simplified for now)
        effort_hours = (team_size * actual_duration * 160) * complexity_factor * experience_factor

        # Base cost = effort * hourly rate * location
        base_cost = effort_hours * hourly_rate * location_multiplier

        # Add object point cost as proxy for functionality
        feature_cost = object_points * 15  # $15 per object point (example)

        # Final estimated cost
        estimated_cost = (base_cost + overhead_cost + additional_cost + feature_cost) * risk_factor

        return jsonify({
            'estimatedCost': round(estimated_cost, 2),
            'effortHours': round(effort_hours, 1),
            'teamSize': team_size,
            'duration': actual_duration
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)

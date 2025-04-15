import React, { useState } from 'react';

// --- Mappings from Frontend Selections to Backend Codes ---
// Examples - adjust or remove if using direct number inputs matching backend codes
// const riskManagementMap = { Low: 1, Medium: 3, High: 5 };
// const economicInstabilityMap = { Low: 1, Medium: 3, High: 5 };
// ... other maps ...

function Page() {
    // --- State Variables ---
    const [dedicatedTeamMembers, setDedicatedTeamMembers] = useState(''); // Number
    const [juniornos, setjuniornos] = useState(''); // String for input, parsed to number
    const [midnos, setmidnos] = useState(''); // String for input, parsed to number
    const [seniornos, setseniornos] = useState(''); // String for input, parsed to number

    const [objectPoints, setObjectPoints] = useState(''); // String for input, parsed to number
    const [riskManagement, setRiskManagement] = useState('3'); // Backend code (1-5)
    const [economicInstability, setEconomicInstability] = useState('2'); // Backend code (1-5)
    const [developmentType, setDevelopmentType] = useState('1'); // Backend code (1-4)
    const [applicationDomain, setApplicationDomain] = useState('6'); // Backend code (1-7)
    const [reliabilityRequirements, setReliabilityRequirements] = useState('4'); // Backend code (1-5)
    const [incomeSatisfaction, setIncomeSatisfaction] = useState('3'); // Backend code (1-5)
    const [scheduleQuality, setScheduleQuality] = useState('2'); // Backend code (1-4)
    const [toolExperience, setToolExperience] = useState('3'); // Backend code (1-5)
    const [numberOfLanguages, setNumberOfLanguages] = useState(''); // String for input, parsed to number

    // Inputs required by backend but missing from original form (using defaults)
    // !! IMPORTANT: Add proper form inputs for these fields !!
    const [otherSizingMethod, setOtherSizingMethod] = useState('2'); // Default backend code
    const [topManagementOpinion, setTopManagementOpinion] = useState('1'); // Default backend code (0/1)
    const [devEnvAdequacy, setDevEnvAdequacy] = useState('1'); // Default backend code (needs scale)
    const [userResistance, setUserResistance] = useState('3'); // Default backend code (needs scale)
    const [commentsCode, setCommentsCode] = useState('3'); // Default backend code (1-4)
    const [orgMgmtClarity, setOrgMgmtClarity] = useState('2'); // Default backend code (1-3)
    const [teamCohesion, setTeamCohesion] = useState('5'); // Default backend code (needs scale 1-5)

    // Cost parameters
    const [hourlyRate, setHourlyRate] = useState(''); // String for input, parsed to number
    const [location, setLocation] = useState('US'); // String matching backend map key
    const [productComplexity, setProductComplexity] = useState('High'); // String matching backend map key
    const [techStack, setTechStack] = useState('MERN'); // String matching backend map key
    const [overheadCost, setOverheadCost] = useState(''); // String for input, parsed to number
    const [additionalCost, setAdditionalCost] = useState(''); // String for input, parsed to number

    // New state for desired duration
    const [desiredDuration, setDesiredDuration] = useState('');

    // Results and Errors
    const [apiResponse, setApiResponse] = useState(null);
    const [error, setError] = useState('');

    // *** DEBUG LOG: Check state on component render/re-render ***
    console.log("Component rendering/re-rendering. apiResponse state:", apiResponse);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setApiResponse(null); // Clear previous results

        // --- Input Validation and Parsing ---
        const numJuniors = parseInt(juniornos || '0');
        const numMid = parseInt(midnos || '0');
        const numSeniors = parseInt(seniornos || '0');
        const calculatedTeamSize = numJuniors + numMid + numSeniors;

        if (calculatedTeamSize <= 0) {
            setError("Team size must be greater than zero (check junior/mid/senior counts).");
            return;
        }

        // Parse other numeric fields, handle potential NaN or empty strings
        const parsedDedicatedMembers = parseInt(dedicatedTeamMembers || '0');
        const parsedObjectPoints = parseFloat(objectPoints || '0');
        const parsedNumLanguages = parseInt(numberOfLanguages || '0');
        const parsedHourlyRate = parseFloat(hourlyRate || '0');
        const parsedOverhead = parseFloat(overheadCost || '0');
        const parsedAdditional = parseFloat(additionalCost || '0');
        const parsedDesiredDuration = parseFloat(desiredDuration || '0');

        // --- Construct Payload with Correct Keys and Parsed/Mapped Values ---
        const payload = {
            // Model Inputs (ensure types match backend expectations - mostly numbers)
            "Team size": calculatedTeamSize,
            "Dedicated team members": parsedDedicatedMembers,
            "Degree of risk management": parseInt(riskManagement),
            "Economic instability impact": parseInt(economicInstability),
            "Reliability requirements": parseInt(reliabilityRequirements),
            "Schedule quality": parseInt(scheduleQuality),
            "Software tool experience": parseInt(toolExperience),
            "Organization management structure clarity": parseInt(orgMgmtClarity),
            "Team cohesion": parseInt(teamCohesion),
            "Development type": parseInt(developmentType),
            "Application domain": parseInt(applicationDomain),
            "Object points": parsedObjectPoints,
            "Other sizing method": parseInt(otherSizingMethod), // From default state - add input
            "Top management opinion of previous system": parseInt(topManagementOpinion), // From default state - add input
            "Development environment adequacy": parseInt(devEnvAdequacy), // From default state - add input
            "# Multiple programing languages ": parsedNumLanguages, // NOTE THE KEY NAME!
            "User resistance": parseInt(userResistance), // From default state - add input
            "Income satisfaction": parseInt(incomeSatisfaction),
            "Comments within the code": parseInt(commentsCode), // From default state - add input
            "Actual duration": parsedDesiredDuration,
            // Cost Calculation Inputs
            "Juniors": numJuniors,
            "Mid": numMid,
            "Seniors": numSeniors,
            "Location": location, // String
            "Tech-stack": techStack, // String
            "Complexity level": productComplexity, // String
            "Hourly Rate": parsedHourlyRate,
            "Overhead": parsedOverhead,
            "Additional costs": parsedAdditional

            // Desired Duration
            
        };

        // Log payload for debugging just before sending
        console.log("Sending Payload:", JSON.stringify(payload, null, 2));

        try {
            const response = await fetch('http://127.0.0.1:5000/estimate', { // Ensure Flask is running
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json(); // Always try to parse JSON

             // *** DEBUG LOG: Log received response data ***
            console.log("Received response data in React:", responseData);

            if (!response.ok) {
                // Use error message from backend if available, otherwise use status text
                throw new Error(responseData.error || response.statusText || `HTTP error! status: ${response.status}`);
            }

            // *** DEBUG LOG: Log before setting state ***
            console.log("Setting apiResponse state with:", responseData);

            setApiResponse(responseData); // Store the full response object

        } catch (err) {
            console.error('Error submitting form:', err);
            setError(`Estimation failed: ${err.message}`);
            setApiResponse(null); // Clear response state on error
        }
    };

    // --- JSX Form (Simplified - Add inputs for missing fields) ---
    // Using fieldsets to group inputs
    return (
        <div style={{ margin: '1rem', fontFamily: 'sans-serif' }}>
            <h2>Software Cost Estimation</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', maxWidth: '1000px' }}>

                {/* --- Team Composition --- */}
                <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                    <legend>Team Composition</legend>
                    <div>
                        <label>No. of Junior Developers:</label><br />
                        <input required type="number" min="0" value={juniornos} onChange={(e) => setjuniornos(e.target.value)} placeholder="e.g., 4" style={{ width: '95%', padding: '5px' }} />
                    </div>
                    <div>
                        <label>No. of Mid-Level Developers:</label><br />
                        <input required type="number" min="0" value={midnos} onChange={(e) => setmidnos(e.target.value)} placeholder="e.g., 4" style={{ width: '95%', padding: '5px' }}/>
                    </div>
                    <div>
                        <label>No. of Senior Developers:</label><br />
                        <input required type="number" min="0" value={seniornos} onChange={(e) => setseniornos(e.target.value)} placeholder="e.g., 2" style={{ width: '95%', padding: '5px' }}/>
                    </div>
                    <div>
                        <label>Dedicated Team Members (Count/Value):</label><br />
                        <input required type="number" min="0" value={dedicatedTeamMembers} onChange={(e) => setDedicatedTeamMembers(e.target.value)} placeholder="e.g. 8" style={{ width: '95%', padding: '5px' }}/>
                    </div>
                   </fieldset>

                    {/* --- Project Details --- */}
                    <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                        <legend>Project Details</legend>
                        <div>
                            <label>Object Points:</label><br />
                            <input required type="number" min="0" value={objectPoints} onChange={(e) => setObjectPoints(e.target.value)} placeholder="e.g., 250" style={{ width: '95%', padding: '5px' }}/>
                        </div>
                        <div>
                            <label>Number of Languages:</label><br />
                            <input required type="number" min="0" value={numberOfLanguages} onChange={(e) => setNumberOfLanguages(e.target.value)} placeholder="e.g., 1" style={{ width: '95%', padding: '5px' }}/>
                        </div>
                        {/* !! Add Input for 'Other sizing method' (Number) !! */}
                        {/* !! Add Input for 'Development environment adequacy' (Number 1-?) !! */}
                        {/* !! Add Input for 'Comments within the code' (Number 1-4) !! */}
                        <div><i style={{color: 'gray'}}>(Inputs needed for Other Sizing Method, Dev Env Adequacy, Comments)</i></div>
                    </fieldset>

                    {/* --- Factor Ratings --- */}
                    <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                        <legend>Factor Ratings</legend>
                        <div>
                            <label>Development Type:</label><br />
                            <select required value={developmentType} onChange={(e) => setDevelopmentType(e.target.value)} style={{ width: '100%', padding: '5px' }}>
                                <option value="1">New Software Development</option>
                                <option value="2">Upgrading Existing Software</option>
                                <option value="3">Modifying Existing Software</option>
                                <option value="4">Customization of Imported Software</option>
                            </select>
                        </div>
                        <div>
                            <label>Application Domain:</label><br />
                            <select required value={applicationDomain} onChange={(e) => setApplicationDomain(e.target.value)} style={{ width: '100%', padding: '5px' }}>
                                <option value="1">Banking System</option>
                                <option value="2">ERP</option>
                                <option value="3">Mobile Application</option>
                                <option value="5">Financial and managerial</option>
                                <option value="6">Web applications</option>
                                <option value="7">Bespoke applications</option>
                            </select>
                        </div>
                        <div>
                            <label>Reliability Requirements:</label><br />
                            <select required value={reliabilityRequirements} onChange={(e) => setReliabilityRequirements(e.target.value)} style={{ width: '100%', padding: '5px' }}>
                                <option value="1">User dissatisfaction/Inconvenience</option>
                                <option value="2">Minor monetary loss, mitigatable</option>
                                <option value="3">Medium monetary loss, mitigatable</option>
                                <option value="4">Major monetary loss</option>
                                <option value="5">Life threatening</option>
                            </select>
                        </div>
                        <div>
                            <label>Degree of Risk Management (1-5):</label><br />
                            <input required type="number" min="1" max="5" value={riskManagement} onChange={(e) => setRiskManagement(e.target.value)} placeholder="1-5" style={{ width: '95%', padding: '5px' }}/>
                        </div>
                        <div>
                            <label>Economic Instability Impact (1-5):</label><br />
                            <input required type="number" min="1" max="5" value={economicInstability} onChange={(e) => setEconomicInstability(e.target.value)} placeholder="1-5" style={{ width: '95%', padding: '5px' }}/>
                        </div>
                        <div>
                            <label>Income Satisfaction (1-5):</label><br />
                            <select required value={incomeSatisfaction} onChange={(e) => setIncomeSatisfaction(e.target.value)} style={{ width: '100%', padding: '5px' }}>
                                 <option value="1">Very Satisfied</option>
                                 <option value="2">Satisfied</option>
                                 <option value="3">Normal</option>
                                 <option value="4">Unsatisfied</option>
                                 <option value="5">Very Unsatisfied</option>
                            </select>
                        </div>
                        <div>
                            <label>Schedule Quality (1-4):</label><br />
                            <input required type="number" min="1" max="4" value={scheduleQuality} onChange={(e) => setScheduleQuality(e.target.value)} placeholder="1-4" style={{ width: '95%', padding: '5px' }}/>
                        </div>
                        <div>
                            <label>Software Tool Experience (1-5):</label><br />
                            <input required type="number" min="1" max="5" value={toolExperience} onChange={(e) => setToolExperience(e.target.value)} placeholder="1-5" style={{ width: '95%', padding: '5px' }}/>
                        </div>
                        {/* !! Add Input for OrgMgmtClarity (1-3) !! */}
                        {/* !! Add Input for TeamCohesion (1-5) !! */}
                        {/* !! Add Input for TopMgmtOpinion (0/1) !! */}
                        {/* !! Add Input for UserResistance (1-5?) !! */}
                        <div><i style={{color: 'gray'}}>(Inputs needed for Org Clarity, Cohesion, Mgmt Opinion, User Resistance)</i></div>
                    </fieldset>

                    {/* --- Cost Parameters --- */}
                    <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                        <legend>Cost Parameters</legend>
                        <div>
                            <label>Hourly Rate (USD):</label><br />
                            <input required type="number" min="0" step="0.01" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="e.g., 100" style={{ width: '95%', padding: '5px' }}/>
                        </div>
                        <div>
                            <label>Location:</label><br />
                            <select required value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: '5px' }}>
                                {/* Populate with keys from LOCATION_MAP */}
                                <option value="India Tier 2">India Tier 2</option>
                                <option value="India Tier 1">India Tier 1</option>
                                <option value="Eastern Europe">Eastern Europe</option>
                                <option value="Western Europe">Western Europe</option>
                                <option value="US">US</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="Southeast Asia">Southeast Asia</option>
                            </select>
                        </div>
                        <div>
                            <label>Product Complexity:</label><br />
                            <select required value={productComplexity} onChange={(e) => setProductComplexity(e.target.value)} style={{ width: '100%', padding: '5px' }}>
                                 {/* Populate with keys from PRODUCT_COMPLEXITY_MAP */}
                                <option value="Low">Low</option>
                                <option value="Moderate">Moderate</option>
                                <option value="High">High</option>
                                <option value="Very High">Very High</option>
                            </select>
                        </div>
                        <div>
                            <label>Tech Stack:</label><br />
                            <select required value={techStack} onChange={(e) => setTechStack(e.target.value)} style={{ width: '100%', padding: '5px' }}>
                                 {/* Populate with keys from TECH_STACK_MAP */}
                                <option value="MERN">MERN</option>
                                <option value="MEAN">MEAN</option>
                                <option value="Spring Boot">Spring Boot</option>
                                <option value="Django">Django</option>
                                <option value="Flutter">Flutter</option>
                                <option value="Blockchain">Blockchain</option>
                                <option value="React Native">React Native</option>
                                <option value="ASP.NET">ASP.NET</option>
                                <option value="Node">Node</option>
                                <option value="Ruby on Rails">Ruby on Rails</option>
                            </select>
                        </div>
                        <div>
                            <label>Overhead Cost (USD):</label><br />
                            <input required type="number" min="0" step="0.01" value={overheadCost} onChange={(e) => setOverheadCost(e.target.value)} placeholder="e.g., 5000" style={{ width: '95%', padding: '5px' }}/>
                        </div>
                        <div>
                            <label>Additional Cost (USD):</label><br />
                            <input required type="number" min="0" step="0.01" value={additionalCost} onChange={(e) => setAdditionalCost(e.target.value)} placeholder="e.g., 2500" style={{ width: '95%', padding: '5px' }}/>
                        </div>
                    </fieldset>

                    {/* --- Desired Duration Input --- */}
                    <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                        <legend>Timeline</legend>
                        <div>
                            <label>Desired Duration (Months):</label><br />
                            <input required type="number" min={1} step="1" max={24} value={desiredDuration} onChange={(e) => setDesiredDuration(e.target.value)} placeholder="e.g., 6" style={{ width: '95%', padding: '5px' }}/>
                        </div>
                    </fieldset>

                    {/* Submit Button */}
                    <button type="submit" style={{ gridColumn: '1 / -1', padding: '12px', fontSize: '1.1em', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Estimate Cost
                    </button>
            </form>

            {/* --- Display Formatted Results --- */}
            {error && <div style={{ color: 'red', marginTop: '1rem', fontWeight: 'bold', padding: '10px', border: '1px solid red', backgroundColor: '#ffe0e0' }}>{error}</div>}

            {apiResponse && (
                <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid green', borderRadius: '5px' }}>
                    <h3>Estimation Results:</h3>
                    <p>
                        <strong>Predicted Base Effort:</strong>
                         {/* Use toLocaleString for commas, toFixed for decimals */}
                        {` ${Number(apiResponse.predicted_effort_hours).toLocaleString(undefined, { maximumFractionDigits: 2 })} hours`}
                    </p>
                    <h4 style={{ marginTop: '1rem' }}>
                        Total Estimated Project Cost:
                        {/* Format as currency */}
                        {` $${Number(apiResponse.total_project_cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </h4>
                </div>
            )}
        </div>
    );
}

export default Page;
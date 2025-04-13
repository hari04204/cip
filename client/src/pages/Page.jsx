import React, { useState } from 'react';

function Page() {
  const [dedicatedTeamMembers, setDedicatedTeamMembers] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [actualDuration, setActualDuration] = useState('');
  const [objectPoints, setObjectPoints] = useState('');
  const [riskManagement, setRiskManagement] = useState('Medium');  // Default example
  const [economicInstability, setEconomicInstability] = useState('Low');
  const [developmentType, setDevelopmentType] = useState('Function Points');
  const [applicationDomain, setApplicationDomain] = useState('Healthcare');
  const [userInterface, setUserInterface] = useState('Neutral');
  const [reliabilityRequirements, setReliabilityRequirements] = useState('High');
  const [incomeSatisfaction, setIncomeSatisfaction] = useState('Average');
  const [scheduleQuality, setScheduleQuality] = useState('Delayed');
  const [toolExperience, setToolExperience] = useState('Adequate');
  const [numberOfLanguages, setNumberOfLanguages] = useState('');
  const [teamLevel, setTeamLevel] = useState('Junior');
  const [hourlyRate, setHourlyRate] = useState('');
  const [location, setLocation] = useState('India Tier 2');
  const [productComplexity, setProductComplexity] = useState('Moderate');
  const [techStack, setTechStack] = useState('');
  const [overheadCost, setOverheadCost] = useState('');
  const [additionalCost, setAdditionalCost] = useState('');
  
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      dedicatedTeamMembers,
      teamSize: parseFloat(teamSize),
      actualDuration: parseFloat(actualDuration),
      objectPoints: parseFloat(objectPoints),
      riskManagement,
      economicInstability,
      developmentType,
      applicationDomain,
      userInterface,
      reliabilityRequirements,
      incomeSatisfaction,
      scheduleQuality,
      toolExperience,
      numberOfLanguages: parseInt(numberOfLanguages),
      teamLevel,
      hourlyRate: parseFloat(hourlyRate),
      location,
      productComplexity,
      techStack,
      overheadCost: parseFloat(overheadCost),
      additionalCost: parseFloat(additionalCost)
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // Assume your backend returns { "estimatedCost": <some_value> }
      setEstimatedCost(data.estimatedCost);
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while estimating cost.');
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Software Cost Estimation</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
        
        <div>
          <label>Dedicated Team Members</label><br/>
          <input
            type="text"
            value={dedicatedTeamMembers}
            onChange={(e) => setDedicatedTeamMembers(e.target.value)}
            placeholder="e.g., Mix1"
          />
        </div>

        <div>
          <label>Team Size</label><br/>
          <input
            type="number"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            placeholder="4"
          />
        </div>

        <div>
          <label>Actual Duration (months)</label><br/>
          <input
            type="number"
            value={actualDuration}
            onChange={(e) => setActualDuration(e.target.value)}
            placeholder="12"
          />
        </div>

        <div>
          <label>Object Points</label><br/>
          <input
            type="number"
            value={objectPoints}
            onChange={(e) => setObjectPoints(e.target.value)}
            placeholder="150"
          />
        </div>

        <div>
          <label>Risk Management</label><br/>
          <select value={riskManagement} onChange={(e) => setRiskManagement(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label>Economic Instability</label><br/>
          <select value={economicInstability} onChange={(e) => setEconomicInstability(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label>Development Type</label><br/>
          <select value={developmentType} onChange={(e) => setDevelopmentType(e.target.value)}>
            <option value="Function Points">Function Points</option>
            <option value="Lines of Code">Lines of Code</option>
            {/* Add more if needed */}
          </select>
        </div>

        <div>
          <label>Application Domain</label><br/>
          <select value={applicationDomain} onChange={(e) => setApplicationDomain(e.target.value)}>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="eCommerce">eCommerce</option>
            {/* etc. */}
          </select>
        </div>

        <div>
          <label>User Interface</label><br/>
          <select value={userInterface} onChange={(e) => setUserInterface(e.target.value)}>
            <option value="Neutral">Neutral</option>
            <option value="Complex">Complex</option>
            <option value="Minimal">Minimal</option>
          </select>
        </div>

        <div>
          <label>Reliability Requirements</label><br/>
          <select
            value={reliabilityRequirements}
            onChange={(e) => setReliabilityRequirements(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label>Income Satisfaction</label><br/>
          <select value={incomeSatisfaction} onChange={(e) => setIncomeSatisfaction(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Average">Average</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label>Schedule Quality</label><br/>
          <select value={scheduleQuality} onChange={(e) => setScheduleQuality(e.target.value)}>
            <option value="On Track">On Track</option>
            <option value="Delayed">Delayed</option>
            <option value="Ahead">Ahead</option>
          </select>
        </div>

        <div>
          <label>Tool Experience</label><br/>
          <select value={toolExperience} onChange={(e) => setToolExperience(e.target.value)}>
            <option value="Few">Few</option>
            <option value="Adequate">Adequate</option>
            <option value="Extensive">Extensive</option>
          </select>
        </div>

        <div>
          <label>Number of Languages</label><br/>
          <input
            type="number"
            value={numberOfLanguages}
            onChange={(e) => setNumberOfLanguages(e.target.value)}
            placeholder="4"
          />
        </div>

        <div>
          <label>Team Level</label><br/>
          <select value={teamLevel} onChange={(e) => setTeamLevel(e.target.value)}>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div>
          <label>Hourly Rate (USD)</label><br/>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="e.g. 30"
          />
        </div>

        <div>
          <label>Location</label><br/>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="India Tier 2">India Tier 2</option>
            <option value="US Tier 1">US Tier 1</option>
            <option value="Remote">Remote</option>
            {/* ... */}
          </select>
        </div>

        <div>
          <label>Product Complexity</label><br/>
          <select value={productComplexity} onChange={(e) => setProductComplexity(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label>Tech Stack</label><br/>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="MEAN, MERN, etc."
          />
        </div>

        <div>
          <label>Overhead Cost (USD)</label><br/>
          <input
            type="number"
            value={overheadCost}
            onChange={(e) => setOverheadCost(e.target.value)}
            placeholder="2500"
          />
        </div>

        <div>
          <label>Additional Cost (USD)</label><br/>
          <input
            type="number"
            value={additionalCost}
            onChange={(e) => setAdditionalCost(e.target.value)}
            placeholder="1000"
          />
        </div>

        <button type="submit">Estimate Cost</button>
      </form>

      {estimatedCost && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Estimated Cost: {estimatedCost}</h3>
        </div>
      )}

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
    </div>
  );
}

export default Page;

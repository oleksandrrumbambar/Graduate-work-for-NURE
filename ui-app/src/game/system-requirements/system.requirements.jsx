import React from 'react';
import '../game.page.css';

const SystemRequirements = ({ systemRequirements }) => {
  return (
    <div className="system-requirements">
      {Object.entries(systemRequirements).map(([key, value]) => (
        <div className="system-requirements-col" key={key}>
          <h5>{key === 'minimum' ? 'Мінімальні вимоги системи:' : key === 'recommended' ? 'Рекомендовані вимоги системи:' : 'Ультра вимоги системи:'}</h5>
          <ul>
            {Object.entries(value).map(([requirement, detail]) => (
              <li key={requirement}>{requirement.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}: {detail}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SystemRequirements;

import React, { useState, useEffect } from 'react';
import './NavTabs.css';

const NavigationTabs = ({
  tabs = [
    { id: 'stats', label: 'Stats' },
    { id: 'info', label: 'Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'availability', label: 'Availability' },
  ],
  // Controlled prop. If provided, component becomes controlled.
  activeTab: activeTabProp,
  // Uncontrolled initial value
  defaultActive,
  // Callback when active tab changes
  onTabChange,
  // Additional className and passthrough props
  className = '',
  ...rest
}) => {
  const [internalActive, setInternalActive] = useState(() => defaultActive ?? (tabs[0] && tabs[0].id));
  const isControlled = activeTabProp !== undefined;
  const active = isControlled ? activeTabProp : internalActive;

  useEffect(() => {
    // If tabs change and current internal active is missing, reset to first tab
    if (!isControlled && tabs.length && !tabs.find((t) => t.id === internalActive)) {
      setInternalActive(tabs[0].id);
    }
  }, [tabs, internalActive, isControlled]);

  const handleChange = (id) => {
    if (!isControlled) setInternalActive(id);
    if (onTabChange) onTabChange(id);
  };

  return (
    <nav className={`navbartabs ${className}`}>
      <div className="tabContainer">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={`tab ${active === tab.id ? 'tabActive' : ''}`}
            role="tab"
            aria-selected={active === tab.id}
          >
            <span className={`tabLabel ${active === tab.id ? 'tabLabelActive' : ''}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTabs;

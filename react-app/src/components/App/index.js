import React, {useState} from 'react';
import Visualization from "./Visualization";
import {randomLogNormal, randomNormal} from "d3-random";

function App() {
    const [distributions, setDistributions] = useState([
        {'id': 'normal', fn: randomNormal(.5, 1), isActive: true},
        {'id': 'log-normal', fn: randomLogNormal(.5, 1), isActive: false}
    ]);

    const onDistributionChange = dist => evt => setDistributions(distributions.map(d => {
        return {
            ...d,
            isActive: d.id === dist.id
        }
    }));
    return (
        <div className="App">
            <div className="Header">
                {
                    distributions.map(distribution => {
                        return (
                            <button key={`button-for-${distribution.id}`}
                                    className={distribution.isActive ? 'active' : ''}
                                    onClick={onDistributionChange(distribution)}>
                                {distribution.id}
                            </button>
                        )
                    })
                }
            </div>
            <Visualization selectedDistribution={distributions.find(d => d.isActive)}/>
        </div>
    );
}

export default App;

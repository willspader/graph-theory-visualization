import React from 'react';

import SideBar from './sidebar';
import Graph from './graph';



function Home() {
    return (
        <div>
            <div>
                <SideBar />
            </div>
            <div style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                height: '100vh',
                width: '100%'
            }}> 
                <Graph />
            </div>
        </div>
    )
}

export default Home
import React from 'react';
import { useAtom } from 'jotai';
import { 
    cameraPositionAtom, 
    campfireProximityAtom, 
    campfireDistanceAtom, 
    currentSceneAtom,
    coolThingDistanceAtom,
    coolThingProximityAtom
} from '../atoms/gameState';

const DebugBar: React.FC = () => {
    const [_, setCurrentScene] = useAtom(currentSceneAtom);
    const [cameraPos] = useAtom(cameraPositionAtom); // ✅ Get camera position
    const [isNearCampfire] = useAtom(campfireProximityAtom); // ✅ Get campfire proximity status
    const [campfireDistance] = useAtom(campfireDistanceAtom); // ✅ Get exact distance to campfire
    const [isNearCoolThing] = useAtom(coolThingProximityAtom); // ✅ Get cool thing proximity status
    const [coolThingDistance] = useAtom(coolThingDistanceAtom); // ✅ Get exact distance to cool thing

    return (
        <div className="h-10 bg-gray-700 text-white flex items-center text-xs px-4 gap-6 select-none">
            {/* ✅ Display current scene */}
            {/* <span>Scene: {currentScene}</span> */}

            {/* ✅ Scene Switch Buttons */}
            {/* <div className="flex gap-2">
                {['scene1', 'scene2', 'scene3', 'sceneBlank'].map((scene) => (
                    <button 
                        key={scene} 
                        className="bg-gray-500 px-2 py-1 rounded hover:bg-gray-400 transition"
                        onClick={() => setCurrentScene(scene as any)}
                    >
                        {scene}
                    </button>
                ))}
            </div> */}

            {/* ✅ Display Camera Position */}
            {/* <span className="font-mono">
                Camera: 
                <span className="ml-1 text-green-300">X={cameraPos.x.toFixed(2)}</span>,{" "}
                <span className="text-blue-300">Y={cameraPos.y.toFixed(2)}</span>,{" "}
                <span className="text-yellow-300">Zoom={cameraPos.zoom.toFixed(2)}x</span>
            </span> */}

            {/* ✅ Display Campfire Proximity */}
            {/* <span className="font-mono">
                Near Campfire: 
                <span className={`ml-1 ${isNearCampfire ? 'text-green-400' : 'text-red-400'}`}>
                    {isNearCampfire ? 'YES' : 'NO'}
                </span>
            </span> */}

            {/* ✅ Display Distance to Campfire */}
            {/* <span className="font-mono">
                Distance to Campfire: 
                <span className={`ml-1`}>
                    {campfireDistance.toFixed(1)} px
                </span>
            </span> */}

            {/* ✅ Display Cool Thing Proximity */}
            {/* <span className="font-mono">
                Near Cool Thing: 
                <span className={`ml-1 ${isNearCoolThing ? 'text-green-400' : 'text-red-400'}`}>
                    {isNearCoolThing ? 'YES' : 'NO'}
                </span>
            </span> */}

            {/* ✅ Display Distance to Cool Thing */}
            {/* <span className="font-mono">
                Distance to Cool Thing: 
                <span className={`ml-1`}>
                    {coolThingDistance.toFixed(1)} px
                </span>
            </span> */}
        </div>
    );
};

export default DebugBar;

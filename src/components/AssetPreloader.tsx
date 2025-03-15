import { useEffect } from 'react';

const AssetPreloader = () => {
    useEffect(() => {
        const images = [
            'assets/announcements/bad.png',
            'assets/announcements/good.png'
        ];
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        const audioFiles = [
            'assets/sounds/xtal.mp3'
        ];
        audioFiles.forEach((src) => {
            const audio = new Audio(src);
            audio.load();
        });
    }, []);

    return null; // This component doesn't render anything
};

export default AssetPreloader; 
import { useEffect } from 'react';

const ImagePreloader = () => {
    useEffect(() => {
        const images = [
            'assets/announcements/bad.png',
            'assets/announcements/good.png'
        ];
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    return null; // This component doesn't render anything
};

export default ImagePreloader; 
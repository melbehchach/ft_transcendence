import { useEffect, useState} from "react";

interface CountdownProps {
    onCountdownEnd: () => void;
}

export default function Countdown({ onCountdownEnd } : CountdownProps) {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (countdown > 0) {
            const intervalId = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        } else {
            onCountdownEnd();
        }
    }, [countdown, onCountdownEnd]);

    return (
        <>
            <h1 className='text-2xl text-primary text-countdown fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                {countdown}
            </h1>
        </>
    );
}

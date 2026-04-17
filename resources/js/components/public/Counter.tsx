import { useEffect, useRef, useState } from 'react';

export type CounterProps = {
    from?: number;
    to: number;
    durationMs?: number;
    suffix?: string;
};

export function Counter({ from = 0, to, durationMs = 1400, suffix = '' }: CounterProps) {
    const [value, setValue] = useState(from);
    const ref = useRef<HTMLSpanElement | null>(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasStarted.current) {
                        hasStarted.current = true;
                        const start = performance.now();

                        const tick = (now: number) => {
                            const elapsed = now - start;
                            const progress = Math.min(1, elapsed / durationMs);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const current = Math.round(from + (to - from) * eased);
                            setValue(current);
                            if (progress < 1) {
                                requestAnimationFrame(tick);
                            }
                        };

                        requestAnimationFrame(tick);
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [from, to, durationMs]);

    return (
        <span ref={ref}>
            {value}
            {suffix}
        </span>
    );
}


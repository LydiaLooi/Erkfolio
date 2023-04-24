import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import animStyles from "./animation_styles.module.css";

import { useRouter } from 'next/router';
import { getLogger } from '../logging/log-util';


const logger = getLogger("transition")

interface TransitionProps { // https://stackoverflow.com/a/64722865
    // Props if needed go here
    children: ReactNode
}

const variants = {
    out: {
        opacity: 0,
        y: 40,
        transition: {
            duration: 0.45,
        }
    },
    in: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            delay: 0.25
        }
    }
};


const Transition = ({ children }: TransitionProps) => {

    const { asPath } = useRouter();

    return (
        <div className={animStyles.hideOverflow}>
            <motion.div
                key={asPath}
                variants={variants}
                initial="out"
                animate="in"
                exit="out"
            >
                {children}
            </motion.div>
        </div>
    );
};

export default Transition;
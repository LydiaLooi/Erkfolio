// https://codesandbox.io/s/happy-sun-49mzk?file=/src/App.js

import React from "react";
import styles from './kofi-style.module.css';

interface KoFiProps {
    color: string;
    id: string;
    label: string;
}

export default function KoFi(props: KoFiProps): JSX.Element {
    const { color, id, label } = props;
    return (
        <div className={styles.btnContainer}>
            <a
                title={label}
                className={styles.kofiButton}
                style={{ backgroundColor: color }}
                href={"https://ko-fi.com/" + id}
                target="_blank"
                rel="noopener noreferrer"
            >
                <span className={styles.kofitext}>
                    <img
                        src="https://ko-fi.com/img/cup-border.png"
                        className={styles.kofiimg}
                        alt="Ko-Fi button"
                    />
                    {label}
                </span>
            </a>
        </div >
    );
}
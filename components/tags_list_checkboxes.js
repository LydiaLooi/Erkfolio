import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetchTags } from '../fetches/tags_list';
import { getLogger } from '../logging/log-util';
import styles from './form.module.css';
import { longDedupingInterval } from '../fetches/swr_config';
const logger = getLogger('tags-checkboxes')

export default function TagsListCheckboxes({ handleCheckboxChangeMethod }) {

    const [tagNames, setTagNames] = useState([]);


    const { data, error } = useSWR('fetchTags', fetchTags, {
        dedupingInterval: longDedupingInterval,
    })
    if (error) {
        logger.error("An error occured")
        logger.error(error)
    }
    if (!data) {
        logger.info("Loading data...")
    }


    useEffect(() => {
        if (data) {
            logger.info("Data:", data)
            setTagNames(data)
        }
    }, [data]);


    return (
        <div className={styles.field}>
            <label>Tags:</label>
            <ul className={styles.checkboxes}>
                {tagNames.map(({ id, name }) => (
                    <li key={id} className={`${styles.checkbox}`}>
                        <input
                            onChange={handleCheckboxChangeMethod}
                            className={`${styles.checkboxInput}`}
                            type="checkbox"
                            name="tag"
                            value={name}
                            id={`tag-${name}`}
                            defaultChecked={false}
                        />
                        <label htmlFor={`tag-${name}`}>{name}</label>
                    </li>
                ))}
            </ul>
        </div>
    )
}
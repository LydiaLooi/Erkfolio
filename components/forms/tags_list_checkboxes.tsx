import { ChangeEvent, useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetchTags } from '../../fetches/tags_list';
import { getLogger } from '../../logging/log-util';
import styles from './form.module.css';
import { longDedupingInterval } from '../../fetches/swr_config';
import { TagDataInterface } from '../../interfaces/firebase_interfaces';
const logger = getLogger('tags-checkboxes')


interface TagsListCheckboxesProps {
    handleCheckboxChangeMethod: (e: ChangeEvent<HTMLInputElement>) => void,
    existingTags?: Array<TagDataInterface>,
}

interface CheckboxListProp {
    handleCheckboxChangeMethod: (e: ChangeEvent<HTMLInputElement>) => void,
}


function compareTagDataInterface(a: TagDataInterface, b: TagDataInterface) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}

function FetchTagDataCheckboxes({ handleCheckboxChangeMethod }: CheckboxListProp) {

    const [tagNames, setTagNames] = useState<Array<TagDataInterface>>([]);

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
            data.sort(compareTagDataInterface);

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

interface ExistingTagDataCheckboxesProps {
    handleCheckboxChangeMethod: (e: ChangeEvent<HTMLInputElement>) => void,
    existingTags: Array<TagDataInterface>,
}

function ExistingTagDataCheckboxes({ handleCheckboxChangeMethod, existingTags }: ExistingTagDataCheckboxesProps) {

    const [tagNames, setTagNames] = useState<Array<TagDataInterface>>([]);

    useEffect(() => {
        existingTags.sort(compareTagDataInterface)
        setTagNames(existingTags)
    }, [existingTags])


    return (
        <div className={styles.field}>
            <ul className={styles.checkboxes}>
                {tagNames.map(({ id, name }) => (
                    <li key={id} className={`${styles.checkbox}`}>
                        <input
                            onChange={handleCheckboxChangeMethod}
                            className={`${styles.checkboxInput} ${styles.altCheckbox}`}
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

export default function TagsListCheckboxes({ handleCheckboxChangeMethod, existingTags }: TagsListCheckboxesProps) {

    if (!existingTags) {
        return (
            <FetchTagDataCheckboxes handleCheckboxChangeMethod={handleCheckboxChangeMethod} />
        )
    } else {
        return (<ExistingTagDataCheckboxes handleCheckboxChangeMethod={handleCheckboxChangeMethod} existingTags={existingTags} />)
    }
}
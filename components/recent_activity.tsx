import Link from "next/link"
import utilsStyles from "../styles/utils.module.css"
import Date from "./date"
import recentStyles from "./recent_activity.module.css"
import { RecentActivityInterface } from "../interfaces/firebase_interfaces";
import { useEffect, useState } from "react";
import useSWR from 'swr'
import { fetchRecentActivity } from "../fetches/fetch_recent_activity";
import { longDedupingInterval } from "../fetches/swr_config";
import { getLogger } from "../logging/log-util";
import { capitalizeFirstLetter } from "../fetches/utils";

const logger = getLogger("recent-activity")

export default function RecentActivity() {

    const [activityData, setActivityData] = useState<Array<RecentActivityInterface>>([]);

    const { data, error } = useSWR('recent-activity', fetchRecentActivity, {
        dedupingInterval: longDedupingInterval,
    })
    if (error) {
        logger.error("An error occured: ", error)
    }
    if (!data) {
        logger.info("Loading data...")
    }

    useEffect(() => {
        if (data) {
            setActivityData(data);
        }
    }, [data]);



    return (
        <div> {activityData.length > 0 ?

            <div>
                <h2 className={utilsStyles.underline}>Recent Activity</h2>
                <ul className={recentStyles.recentContainer}>
                    {activityData.map(({ id, title, action, type, date_created }) => (
                        <li key={id}>
                            <small><Date dateString={date_created} /> - {capitalizeFirstLetter(action)}ed <b>{title}</b> to
                                {type === "art" ? (
                                    <Link href="/gallery"> the gallery</Link>
                                ) : type === process.env.DIGITAL_GALLERY_TAG ? (
                                    <Link href="/gallery/digital"> the digital gallery</Link>
                                ) : type === process.env.TRADITIONAL_GALLERY_TAG ? (
                                    <Link href="/gallery/traditional"> the traditional gallery</Link>
                                ) : type === "misc" ? (
                                    <Link href="/gallery/misc"> the misc. gallery</Link>
                                ) : type === "project" ? (
                                    <Link href="/other"> other</Link>
                                ) : null}
                            </small>
                        </li>
                    ))}
                </ul>
            </div>


            : null}

        </div>
    )
}

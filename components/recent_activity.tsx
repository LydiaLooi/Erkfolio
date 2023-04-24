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
import { capitalizeFirstLetter, toPastTense } from "../fetches/utils";

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

    function getGalleryLink(type: string) {
        switch (type) {
            case "art":
                return { linkText: "the gallery", linkPath: "gallery" };
            case process.env.DIGITAL_GALLERY_TAG:
                return { linkText: "the digital gallery", linkPath: "gallery/digital" };
            case process.env.TRADITIONAL_GALLERY_TAG:
                return { linkText: "the traditional gallery", linkPath: "gallery/traditional" };
            case "misc":
                return { linkText: "the misc. gallery", linkPath: "gallery/misc" };
            case "project":
                return { linkText: "other", linkPath: "other" };
            default:
                return { linkText: "... something?", linkPath: "" };
        }
    }


    return (
        <div> {activityData.length > 0 ?

            <div>
                <h2 className={utilsStyles.underline}>Recent Activity</h2>
                <ul className={recentStyles.recentContainer}>
                    {activityData.map(({ id, title, action, type, date_created }) => (
                        <li key={id}>
                            <small><Date dateString={date_created} /> - {toPastTense(capitalizeFirstLetter(action))} <b>{title}</b> to{" "}
                                {type &&
                                    <Link href={`/${getGalleryLink(type).linkPath}`}>{" "}
                                        {`${getGalleryLink(type).linkText}`}
                                    </Link>}
                            </small>
                        </li>
                    ))}
                </ul>
            </div>


            : null}

        </div>
    )
}

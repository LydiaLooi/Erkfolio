import { parseISO, format } from 'date-fns';
import { getLogger } from '../logging/log-util';

const logger = getLogger("date")

export default function Date({ dateString }: { dateString?: string }) {
    if (!dateString) {
        return <></>
    }
    try {
        logger.debug(dateString)
        const date = parseISO(dateString);
        return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
    } catch (error) {
        logger.error(error)
        return <>dateString</>
    }
}

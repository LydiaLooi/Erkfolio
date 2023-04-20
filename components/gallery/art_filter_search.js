import { useEffect, useState } from "react";
import { getLogger } from "../../logging/log-util";
const logger = getLogger("filter-search")

import searchStyles from '../../styles/search.module.css'
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FilterSearch({ artData, updateMethod, originalData }) {

    // Need to have a state for the originalData - as this can change when more is loaded.
    let [originalDataState, setOriginalDataState] = useState({});

    useEffect(() => {
        logger.debug("FilterSearch originalData is being updated.")
        setOriginalDataState(originalData);
    }, [originalData]);

    useEffect(() => {
        logger.debug("Filtering if available.. length of originalDataState", originalDataState.length)
        filterIfAvailable()
    }, [originalDataState])

    function filterIfAvailable() {
        // Check if there is a tagword. If there is, perform the filter
        let search = document.getElementById('filter-search');
        let tag_word = search.value.trim().toLowerCase();
        if (tag_word.length > 0) {
            let msg = document.getElementById('error-msg')
            msg.style.opacity = 0;
            filterClient(tag_word)
        }

    }

    function filterClient(tag_word) {
        let results = originalDataState.filter(obj => obj.tagsArray.includes(tag_word))


        if (results.length > 0) {
            updateMethod(results)
        } else {
            let msg = document.getElementById('error-msg')
            msg.style.opacity = 1;
        }
    }

    function clearFilters() {
        let search = document.getElementById('filter-search');
        search.value = "";

        let msg = document.getElementById('error-msg')
        msg.style.opacity = 0;
        updateMethod(originalDataState)
    }


    function handleInput() {
        let msg = document.getElementById('error-msg')
        msg.style.opacity = 0;
    }

    function handleKeyUp(e) {
        if (e.key === 'Enter') {
            filterIfAvailable()
        }
    }


    return (
        <div className={searchStyles.searchContainer}>

            <input id="filter-search" type="text" placeholder="Filter results by tag" name="search" onInput={handleInput} onKeyUp={handleKeyUp} />
            <button type="button" onClick={filterIfAvailable}>
                <FontAwesomeIcon
                    icon={faSearch}
                />
            </button>
            <button type="button" onClick={clearFilters}>
                <FontAwesomeIcon
                    icon={faTimes}
                />
            </button>
            <br />
            <small id="error-msg" className="errorMessage"><i>None of the results have that tag</i></small>
        </div>
    )
}
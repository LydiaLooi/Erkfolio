import { useEffect, useState, KeyboardEvent } from "react";
import { getLogger } from "../../logging/log-util";
const logger = getLogger("filter-search")

import searchStyles from '../../styles/search.module.css'
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArtInterface } from "../../interfaces/firebase_interfaces";

interface FilterSearchProps {
    updateMethod: (arg: Array<ArtInterface>) => void,
    artResultsData: Array<ArtInterface>,
}

export default function FilterSearch({ updateMethod, artResultsData }: FilterSearchProps) {

    // Need to have a state for the originalData - as this can change when more is loaded.
    let [artResultsDataState, setArtResultsState] = useState<Array<ArtInterface>>();

    useEffect(() => {
        logger.debug("FilterSearch originalData is being updated.")
        setArtResultsState(artResultsData);
    }, [artResultsData]);

    useEffect(() => {
        if (artResultsDataState) {
            logger.debug("Filtering if available.. length of originalDataState", artResultsDataState.length)
        }
        filterIfAvailable()
    }, [artResultsDataState])

    function getSearchInputElement() {
        let search = document.getElementById('filter-search') as HTMLInputElement;
        if (!search) {
            throw new Error("Element filter-search could not be found")
        }
        return search
    }

    function getErrorMessageElement() {
        let msg = document.getElementById('error-msg')
        if (!msg) {
            throw new Error("Element error-msg could not be found")
        }
        return msg
    }

    function filterIfAvailable() {
        // Check if there is a tagword. If there is, perform the filter
        let search = getSearchInputElement()
        let tag_word = search.value.trim().toLowerCase();
        if (tag_word.length > 0) {
            let msg = getErrorMessageElement()
            msg.style.opacity = "0";
            filterClient(tag_word)
        }
    }

    function filterClient(tag_word: string) {
        if (!artResultsDataState) {
            throw new Error("Art results haven't loaded yet.")
        }
        let results = artResultsDataState.filter(obj => obj.tagsArray.includes(tag_word))


        if (results.length > 0) {
            updateMethod(results)
        } else {
            let msg = document.getElementById('error-msg')
            if (!msg) {
                throw new Error("Element error-msg could not be found")
            }
            msg.style.opacity = "1";
        }
    }

    function clearFilters() {
        let search = getSearchInputElement()
        search.value = "";

        let msg = getErrorMessageElement()
        msg.style.opacity = "0";

        if (artResultsDataState) {
            updateMethod(artResultsDataState)
        } else {
            logger.warn("Art results hasn't loaded yet")
        }
    }


    function handleInput() {
        let msg = getErrorMessageElement()
        msg.style.opacity = "0";
    }

    function handleKeyUp(e: KeyboardEvent<HTMLInputElement>) {
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
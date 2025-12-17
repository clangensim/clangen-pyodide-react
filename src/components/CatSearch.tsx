import Checkbox from "./generic/Checkbox";
import { Cat } from "../python/types";
import CatDisplay from "./CatDisplay";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { TbCaretLeftFilled, TbCaretRightFilled } from "react-icons/tb";

import "../styles/cat-search.css";
import "../styles/cats-page.css";

function CatSearch({
  catsToSearch,
  catsPerPage=16,
  maxSelection,
  selectedCats, 
  setSelectedCats
}: {
  catsToSearch: Cat[],
  catsPerPage: number,
  maxSelection: number,
  selectedCats: string[], 
  setSelectedCats: Dispatch<SetStateAction<string[]>>
}) {
  const [searchName, setSearchName] = useState("");

  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({
    newborn: true, kitten: true,
    apprentice: true, mediatorapprentice: true,
    medicinecatapprentice: true,
    warrior: true, mediator: true,
    medicinecat: true,
    elder: true,
    deputy: true, leader: true,
  });

  const [affiliationEnabled, setAffiliationEnabled] = useState<boolean>(false);
  const [miscFilters, setMiscFilters] = useState<Record<string, any>>({
    // Experience Filters
    untrained: true, trainee: true,
    prepared: true, competent: true,
    proficient: true, expert: true,
    master: true,

    // Affilication Filters
    mentor: true, apprentice: true
  });

  const [currentPage, setCurrentPage] = useState<number>(0);

  function checkFilters(cat: Cat) {
    let metNameFilter = searchName == "" ? true : cat.name.display.toLowerCase().includes(searchName); // True by default since name filter can be empty.
    let metStatusFilter = statusFilters[cat.status.replace(/\s/g,'')];
    let metExperienceFilter = miscFilters[cat.experienceLevel];

    let metMentorFilter = false;
    let metApprenticeFilter = false;
    if (miscFilters["mentor"]) { // Valid if cat is apprentice of a selected cat.
      metMentorFilter = cat.mentor ? selectedCats.includes(cat.mentor.ID) : false;
    }
    if (miscFilters["apprentice"]) { // Valid if cat has an apprentice in selected cats.
      let found = cat.apprentices.find(c => selectedCats.includes(c.ID));
      metApprenticeFilter = found != undefined;
    }

    if (affiliationEnabled) {
      return (metMentorFilter || metApprenticeFilter);
    }

    return (metNameFilter && metStatusFilter && metExperienceFilter);
  }

  function toggleStatusFilter(filterName: string) {
    let not = !statusFilters[filterName];
    setStatusFilters({
      ...statusFilters,
      [filterName]: not
    });
  }

  function toggleAllStatusFilters(state: boolean) {
    for (const [name, _] of Object.entries(statusFilters)) {
      statusFilters[name] = state;
    }
    setStatusFilters({
      ...statusFilters
    });
  }

  function setMiscFilter(filter: string, value: any) {
    setMiscFilters({
      ...miscFilters,
      [filter]: value
    })
  }

  function toggleCatSelected(cat: Cat) {
    if (selectedCats.includes(cat.ID)) {
      setSelectedCats(selectedCats.filter(c => c != cat.ID));
      return;
    }

    if (selectedCats.length >= 6) {
      return;
    }

    setSelectedCats(selectedCats.concat(cat.ID));
  }

  function selectRandom(numOfCats: number = 1) {
    setSelectedCats([]);
    let randomCats: string[] = [];
    for (let i = 0; i < Math.min(numOfCats, catsToSearch.length); i++) {
      let index = Math.floor(Math.random() * catsToSearch.length);
      while (randomCats.includes(catsToSearch[index].ID)) {
        index = Math.floor(Math.random() * catsToSearch.length);
      }
      randomCats.push(catsToSearch[index].ID);
    }
    setSelectedCats(randomCats);
  }

  function paginate() {
    let pages = [];
    for (let i = 0; i < catsToSearch.length; i += catsPerPage) {
      pages.push(catsToSearch.slice(i, i + catsPerPage));
    }
    return pages;
  }

  const catPages = paginate();

  return (
    <div className="cat-search-container">
      <div className="cat-search-filters">
        <input type="text" placeholder="Search by name..." value={searchName} onChange={(e) => setSearchName(e.target.value.toLowerCase())}/>
        <details>
          <summary>Status Filters</summary>
          <ul>
            <Checkbox label="Newborn" checked={statusFilters["newborn"]} onChange={() => toggleStatusFilter("newborn")}/>
            <Checkbox label="Kitten" checked={statusFilters["kitten"]} onChange={() => toggleStatusFilter("kitten")}/>
            <Checkbox label="Apprentice" checked={statusFilters["apprentice"]} onChange={() => toggleStatusFilter("apprentice")}/>
            <Checkbox label="Mediator Apprentice" checked={statusFilters["mediatorapprentice"]} onChange={() => toggleStatusFilter("mediatorapprentice")}/>
            <Checkbox label="Medicine Cat Apprentice" checked={statusFilters["medicinecatapprentice"]} onChange={() => toggleStatusFilter("medicinecatapprentice")}/>
            <Checkbox label="Warrior" checked={statusFilters["warrior"]} onChange={() => toggleStatusFilter("warrior")}/>
            <Checkbox label="Mediator" checked={statusFilters["mediator"]} onChange={() => toggleStatusFilter("mediator")}/>
            <Checkbox label="Medicine Cat" checked={statusFilters["medicinecat"]} onChange={() => toggleStatusFilter("medicinecat")}/>
            <Checkbox label="Elder" checked={statusFilters["elder"]} onChange={() => toggleStatusFilter("elder")}/>
            <Checkbox label="Deputy" checked={statusFilters["deputy"]} onChange={() => toggleStatusFilter("deputy")}/>
            <Checkbox label="Leader" checked={statusFilters["leader"]} onChange={() => toggleStatusFilter("leader")}/>
          </ul>
          <button tabIndex={0} onClick={() => toggleAllStatusFilters(true)}>Select All</button>
          <button tabIndex={0} onClick={() => toggleAllStatusFilters(false)}>Deselect All</button>
        </details>
        <details>
          <summary>Experience Filters</summary>
          <ul>
            <Checkbox label="Untrained" checked={miscFilters["untrained"]} onChange={() => setMiscFilter("untrained", !miscFilters["untrained"])}/>
            <Checkbox label="Trainee" checked={miscFilters["trainee"]} onChange={() => setMiscFilter("trainee", !miscFilters["trainee"])}/>
            <Checkbox label="Prepared" checked={miscFilters["prepared"]} onChange={() => setMiscFilter("prepared", !miscFilters["prepared"])}/>
            <Checkbox label="Competent" checked={miscFilters["competent"]} onChange={() => setMiscFilter("competent", !miscFilters["competent"])}/>
            <Checkbox label="Proficient" checked={miscFilters["proficient"]} onChange={() => setMiscFilter("proficient", !miscFilters["proficient"])}/>
            <Checkbox label="Expert" checked={miscFilters["expert"]} onChange={() => setMiscFilter("expert", !miscFilters["expert"])}/>
            <Checkbox label="Master" checked={miscFilters["master"]} onChange={() => setMiscFilter("master", !miscFilters["master"])}/>
          </ul>
        </details>
        <details>
          <summary>Mentor/Apprentice Filters</summary>
          <p>(Filters by mentors/apprentices of selected cats)</p>
          <Checkbox label="Enable Filter" checked={affiliationEnabled} onChange={() => setAffiliationEnabled(!affiliationEnabled)}/>
          <ul>
            <Checkbox label="Mentor of" checked={miscFilters["apprentice"]} onChange={() => setMiscFilter("apprentice", !miscFilters["apprentice"])}/>
            <Checkbox label="Apprentice of" checked={miscFilters["mentor"]} onChange={() => setMiscFilter("mentor", !miscFilters["mentor"])}/>
          </ul>
        </details>
      </div>
      <div className="cat-search-cats">
        <div className="cats-list">
          {
            catPages[currentPage].filter(checkFilters).map((cat) => {
              return (
                <div className="cat cat-search-select">
                  <Checkbox
                    label={
                      <div>
                        <CatDisplay cat={cat} w="75px" h="75px" />
                        <div>{cat.name.display}</div>
                        <div className="cat-search-select-status">{cat.status}</div>
                      </div>
                    }
                    checked={selectedCats.includes(cat.ID)}
                    onChange={() => toggleCatSelected(cat)}
                  />
                </div>
              );
            })
          }
        </div>
        <div className="cat-search-page-controls">
          <button tabIndex={0} 
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))} 
            disabled={currentPage == 0}
          >
            <TbCaretLeftFilled />
          </button>
          <div>
            {currentPage + 1} of {catPages.length}
          </div>
          <button tabIndex={0}
            onClick={() => setCurrentPage(Math.min(currentPage + 1, catPages.length - 1))} 
            disabled={currentPage == catPages.length - 1}
          >
            <TbCaretRightFilled />
          </button>
        </div>
        <div className="cat-search-page-controls">
          <button tabIndex={0} 
            onClick={() => selectRandom()} 
            disabled={selectedCats.length == maxSelection}
          >
            Select Random
          </button>
          <button tabIndex={0} 
            onClick={() => selectRandom(maxSelection)}
          >
            Select Random All
          </button>
          <button tabIndex={0}
            onClick={() => setSelectedCats([])} 
            disabled={selectedCats.length == 0}
          >
            Deselect All
          </button>
        </div>
      </div>
    </div>
  );
}

export default CatSearch;

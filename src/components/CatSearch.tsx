import Checkbox from "./generic/Checkbox";
import { Cat } from "../python/types";
import CatDisplay from "./CatDisplay";
import { Dispatch, SetStateAction, useState } from "react";
import { TbCaretLeftFilled, TbCaretRightFilled } from "react-icons/tb";

import "../styles/cat-search.css";

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

  const [filters, setFilters] = useState<Record<string, Record<string, boolean>>>({
    status: {
      newborn: true, kitten: true,
      apprentice: true, ["mediator apprentice"]: true,
      ["medicine cat apprentice"]: true,
      warrior: true, mediator: true,
      ["medicine cat"]: true,
      elder: true,
      deputy: true, leader: true,
    },
    experience: {
      untrained: true, trainee: true,
      prepared: true, competent: true,
      proficient: true, expert: true,
      master: true
    },
    affiliation: {
      mentor: false, apprentice: false,
      mates: false,
    }
  });

  const [currentPage, setCurrentPage] = useState<number>(0);

  function checkFilters(cat: Cat) {
    const metNameFilter = searchName == "" ? true : cat.name.display.toLowerCase().includes(searchName); // True by default since name filter can be empty.
    const metStatusFilter = filters["status"][cat.status];
    const metExperienceFilter = filters["experience"][cat.experienceLevel];

    const metMentorFilter = cat.mentor ? selectedCats.includes(cat.mentor.ID) : false; // Valid if cat is apprentice of a selected cat.
    const metApprenticeFilter = cat.apprentices.find(c => selectedCats.includes(c.ID)) != undefined; // Valid if cat has an apprentice in selected cats.
    const metMatesFilter = cat.mates.find(c => selectedCats.includes(c.ID)) != undefined; // Valid if cat has a mate in selected cats.

    const affiliationFilters = filters["affiliation"];
    if (Object.values(affiliationFilters).some(filter => filter)) {
      return (
        (affiliationFilters["mentor"] && metMentorFilter)
        || (affiliationFilters["apprentice"] && metApprenticeFilter) 
        || (affiliationFilters["mates"] && metMatesFilter)
      );
    }

    return (metNameFilter && metStatusFilter && metExperienceFilter);
  }

  function toggleFilter(filterCategory: string, filter: string, value: boolean | undefined = undefined)
  {
    if (value == undefined) {
      value = !filters[filterCategory][filter];
    }
    setFilters({
      ...filters,
      [filterCategory]: {
        ...filters[filterCategory],
        [filter]: value
      }
    });
  }

  function toggleAllFilters(filterCategory: string, value: boolean | undefined = undefined)
  {
    for (const [name, _] of Object.entries(filters[filterCategory]))
    {
      if (value == undefined) {
        value = !filters[filterCategory][name];
      }
      filters[filterCategory][name] = value;
    }
    setFilters({
      ...filters
    });
  }

  function toggleCatSelected(cat: Cat) {
    if (selectedCats.includes(cat.ID)) {
      setSelectedCats(selectedCats.filter(c => c != cat.ID));
      return;
    }

    if (selectedCats.length >= maxSelection) {
      return;
    }

    setSelectedCats(selectedCats.concat(cat.ID));
  }

  function appendRandom(numOfCats: number = 1, resetSelected: boolean = false) {
    const currentlySelected = resetSelected ? [] : [...selectedCats];

    const selectableCats = catsToSearch.filter(cat => !currentlySelected.includes(cat.ID) && checkFilters(cat));
    const randomCats: string[] = [];
    for (let i = 0; i < Math.min(selectableCats.length, numOfCats, maxSelection - currentlySelected.length); i++) {
      let index = Math.floor(Math.random() * selectableCats.length);
      while (randomCats.includes(selectableCats[index].ID)) {
        index = Math.floor(Math.random() * selectableCats.length);
      }
      randomCats.push(selectableCats[index].ID);
    }
    
    setSelectedCats(currentlySelected.concat(randomCats));
  }

  const filteredCats = catsToSearch.filter(checkFilters);
  const numPages = Math.max(Math.ceil(filteredCats.length / catsPerPage), 1);

  return (
    <div className="cat-search-container">
      <div className="cat-search-filters">
        <input type="text" placeholder="Search by name..." value={searchName} onChange={(e) => setSearchName(e.target.value.toLowerCase())}/>
        <details>
          <summary>Status Filters</summary>
          <ul>
            {
              Object.keys(filters["status"]).map(name => {
                return (
                  <Checkbox label={name} checked={filters["status"][name]} onChange={() => toggleFilter("status", name)}/>
                )
              })
            }
          </ul>
          <div className="button-row">
            <button tabIndex={0} onClick={() => toggleAllFilters("status", true)}>Select All</button>
            <button tabIndex={0} onClick={() => toggleAllFilters("status", false)}>Deselect All</button>
          </div>
        </details>
        <details>
          <summary>Experience Filters</summary>
          <ul>
            {
              Object.keys(filters["experience"]).map(name => {
                return (
                  <Checkbox label={name} checked={filters["experience"][name]} onChange={() => toggleFilter("experience", name)}/>
                )
              })
            }
          </ul>
          <div className="button-row">
            <button tabIndex={0} onClick={() => toggleAllFilters("experience", true)}>Select All</button>
            <button tabIndex={0} onClick={() => toggleAllFilters("experience", false)}>Deselect All</button>
          </div>
        </details>
        <details>
          <summary>Afilliation Filters</summary>
          <ul>
            <Checkbox label="Mentors of selected cats" checked={filters["affiliation"]["apprentice"]} onChange={() => toggleFilter("affiliation", "apprentice")}/>
            <Checkbox label="Apprentices of selected cats" checked={filters["affiliation"]["mentor"]} onChange={() => toggleFilter("affiliation", "mentor")}/>
            <Checkbox label="Mates of selected cats" checked={filters["affiliation"]["mates"]} onChange={() => toggleFilter("affiliation", "mates")}/>
          </ul>
          <div className="button-row">
            <button tabIndex={0} onClick={() => toggleAllFilters("affiliation", true)}>Select All</button>
            <button tabIndex={0} onClick={() => toggleAllFilters("affiliation", false)}>Deselect All</button>
          </div>
        </details>
      </div>
      <div className="cat-search-cats">
        <div className="cat-search-list">
          {
            filteredCats.slice(currentPage * catsPerPage, currentPage * catsPerPage + catsPerPage).map((cat) => {
              return (
                  <Checkbox
                    className="cat-search-select"
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
              );
            })
          }
        </div>
        <div className="cat-search-page-controls button-row">
          <button tabIndex={0} 
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))} 
            disabled={currentPage == 0}
          >
            <TbCaretLeftFilled />
          </button>
          <div>
            {currentPage + 1} of {numPages}
          </div>
          <button tabIndex={0}
            onClick={() => setCurrentPage(Math.min(currentPage + 1, numPages - 1))} 
            disabled={currentPage == numPages - 1}
          >
            <TbCaretRightFilled />
          </button>
        </div>
        <div className="cat-search-page-controls button-row">
          <button tabIndex={0} 
            onClick={() => appendRandom()} 
            disabled={selectedCats.length == maxSelection}
          >
            Add Random
          </button>
          <button tabIndex={0} 
            onClick={() => appendRandom(maxSelection, true)}
          >
            Select Random Group
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

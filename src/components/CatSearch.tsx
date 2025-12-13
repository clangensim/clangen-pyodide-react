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

  const [filters, setFilters] = useState<{[filter: string]: boolean}>({
    newborn: true, kitten: true,
    apprentice: true, mediatorapprentice: true,
    medicinecatapprentice: true,
    warrior: true, mediator: true,
    medicinecat: true,
    elder: true,
    deputy: true, leader: true,
  });

  const [currentPage, setCurrentPage] = useState<number>(0);

  function checkFilters(cat: Cat): boolean {
    let metNameFilter = true; // True by default since name filter can be empty.
    let metStatusFilter = filters[cat.status.replace(/\s/g,'')];
    if (searchName != "") {
      metNameFilter = cat.name.display.toLowerCase().includes(searchName);
    }

    return metNameFilter && metStatusFilter;
  }

  function toggleFilter(filterName: string): void {
    let not = !filters[filterName];
    setFilters({
      ...filters,
      [filterName]: not
    });
  }

  function toggleAllFilters(state: boolean): void {
    for (const [name, _] of Object.entries(filters)) {
      filters[name] = state;
    }
    setFilters({
      ...filters
    });
  }

  function setNameAndFilter(event: ChangeEvent<HTMLInputElement>): void {
    setSearchName(event.target.value.toLowerCase());
    setFilters({...filters});
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
        <input type="text" placeholder="Search by name..." value={searchName} onChange={setNameAndFilter}/>
        <details>
          <summary>Status Filters</summary>
          <ul>
            <Checkbox label="Newborn" checked={filters["newborn"]} onChange={() => toggleFilter("newborn")}/>
            <Checkbox label="Kitten" checked={filters["kitten"]} onChange={() => toggleFilter("kitten")}/>
            <Checkbox label="Apprentice" checked={filters["apprentice"]} onChange={() => toggleFilter("apprentice")}/>
            <Checkbox label="Mediator Apprentice" checked={filters["mediatorapprentice"]} onChange={() => toggleFilter("mediatorapprentice")}/>
            <Checkbox label="Medicine Cat Apprentice" checked={filters["medicinecatapprentice"]} onChange={() => toggleFilter("medicinecatapprentice")}/>
            <Checkbox label="Warrior" checked={filters["warrior"]} onChange={() => toggleFilter("warrior")}/>
            <Checkbox label="Mediator" checked={filters["mediator"]} onChange={() => toggleFilter("mediator")}/>
            <Checkbox label="Medicine Cat" checked={filters["medicinecat"]} onChange={() => toggleFilter("medicinecat")}/>
            <Checkbox label="Elder" checked={filters["elder"]} onChange={() => toggleFilter("elder")}/>
            <Checkbox label="Deputy" checked={filters["deputy"]} onChange={() => toggleFilter("deputy")}/>
            <Checkbox label="Leader" checked={filters["leader"]} onChange={() => toggleFilter("leader")}/>
          </ul>
        </details>
        <button 
          tabIndex={0}
          onClick={() => toggleAllFilters(true)}
        >
          Select All
        </button>
        <button 
          tabIndex={0}
          onClick={() => toggleAllFilters(false)}
        >
          Deselect All
        </button>
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
      </div>
    </div>
  );
}

export default CatSearch;

import Form from "next/form";
import React from 'react'
import SearchFormReset from "./SearchFormReset";
import { Search } from "lucide-react";

const SearchForm = ({query}: {query?: string}) =>{
    return(
        <Form action="/products" scroll={false} className = "search-form flex flex-col md:flex-row  border-blue-400 rounded-3xl border-2 min-w-2xs  p-2 justify-center">
            <input 
                name="query"
                defaultValue={query}
                className="search-input focus:outline-none"
                placeholder="Search Products"
             />
             <div className = "flex gap-2">
                {query && <SearchFormReset/>}
                <button type="submit" className="search-btn">
                    <Search />
                </button>
             </div>
        </Form>
    )
}

export default SearchForm

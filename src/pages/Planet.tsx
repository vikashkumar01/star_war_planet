import axios from "axios";
import { useEffect, useState } from "react"
import { FaAngleDown } from "react-icons/fa";

interface planetDataType{
    name: string,
    rotation_period: string,
    orbital_period: string,
    diameter: string,
    climate: string,
    gravity: string,
    terrain: string,
    surface_water: string,
    population: string,
    residents: string[],
    string: string[],
    created: string,
    edited: string,
    residentsData: residentDataType[]

}

interface residentDataType {
    name: string,
    height: string,
    mass: string,
    hair_color: string,
    skin_color: string,
    eye_color: string,
    birth_year: string,
    gender: string,

}




const Planet = () => {

    const [planetData, setPlanetData] = useState<planetDataType[]>([]);
    const [openResident, setOpenResident] = useState<boolean>(false);
    const [openResidentIndex, setOpenResidentIndex] = useState<number | null>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [next,setNext] = useState<boolean>(false);
    const [previous,setPrevous] = useState<boolean>(false);
  

    useEffect(() => {
        const fetchData = async () => {
            setLoader(true)
            try {
                const res = await axios.get(`https://swapi.dev/api/planets/?page=${page}&format=json`)
                const planets = res.data.results;
    
                if(res.data.next){
                    setNext(true)
                }
    
                if(res.data.previous){
                    setPrevous(true)
                }
    
                const planetsWithResidents = await Promise.all(
                    planets.map(async (p: planetDataType) => {
                        const residentsData = await Promise.all(
                            p?.residents.map(async (residentUrl) => {
                                const residentResponse = await axios.get(residentUrl);
                                return residentResponse.data;
                            })
                        );
    
                        return { ...p, residentsData };
                    })
                );
    
                setPlanetData(planetsWithResidents);
    
            } catch (err) {
                console.log(err)
            }
    
            setLoader(false)
        }
        fetchData()
    }, [page])

    const openAndCloseResidentHandle = (i: number) => {
        if (openResident) {
            setOpenResident(false)
            setOpenResidentIndex(null)
        } else {
            setOpenResident(true)
            setOpenResidentIndex(i)
        }
    }

    console.log(planetData)

    return (
        <div className="planet-container">
            <span>Planets</span>
            <div>
                {
                    loader && <span>Loading...</span>
                }
                {
                  planetData.length>0 && planetData?.map((p: planetDataType, i: number) => (
                        <div key={i}>

                            <div className="planet">
                                <span>{p?.name}</span>

                                <div>
                                    <span>rotation_period</span>
                                    <span>{p?.rotation_period}</span>
                                </div>
                                <div>
                                    <span>orbital_period</span>
                                    <span>{p?.orbital_period}</span>
                                </div>
                                <div>
                                    <span>diameter</span>
                                    <span>{p?.diameter}</span>
                                </div>
                                <div>
                                    <span>diameter</span>
                                    <span>{p?.diameter}</span>
                                </div>
                                <div>
                                    <span>climate</span>
                                    <span>{p?.climate}</span>
                                </div>
                                <div>
                                    <span>gravity</span>
                                    <span>{p?.gravity}</span>
                                </div>
                                <div>
                                    <span>terrain</span>
                                    <span>{p?.terrain}</span>
                                </div>
                                <div>
                                    <span>surface_water</span>
                                    <span>{p?.surface_water}</span>
                                </div>
                                <div>
                                    <span>population</span>
                                    <span>{p?.population}</span>
                                </div>
                                <div>
                                    <span>created</span>
                                    <span>{p?.created?.substring(0, 10)}</span>
                                </div>
                                <div>
                                    <span>edited</span>
                                    <span>{p?.edited?.substring(0, 10)}</span>
                                </div>
                            </div>

                            <div className="resident">

                                <button onClick={() => openAndCloseResidentHandle(i)}>
                                    <span style={{ marginTop: "1rem" }}>List of Resident</span>
                                    <FaAngleDown />
                                </button>

                                {
                                    (openResident && (openResidentIndex === i)) && <>
                                        <div>
                                            {
                                                p?.residentsData?.length === 0 && <span>No resident found</span>
                                            }
                                        </div>
                                        {
                                            p?.residentsData?.length > 0 && p?.residentsData?.map((r) => (
                                                <div>
                                                    <div>
                                                        <span>Name</span>
                                                        <span>{r.name}</span>
                                                    </div>
                                                    <div>
                                                        <span>Height</span>
                                                        <span>{r.height}</span>
                                                    </div>
                                                    <div>
                                                        <span>Mass</span>
                                                        <span>{r.mass}</span>
                                                    </div>
                                                    <div>
                                                        <span>Hair_Color</span>
                                                        <span>{r.hair_color}</span>
                                                    </div>
                                                    <div>
                                                        <span>Skin_Color</span>
                                                        <span>{r.skin_color}</span>
                                                    </div>
                                                    <div>
                                                        <span>Eye_Color</span>
                                                        <span>{r.eye_color}</span>
                                                    </div>
                                                    <div>
                                                        <span>Birth_Year</span>
                                                        <span>{r.birth_year}</span>
                                                    </div>
                                                    <div>
                                                        <span>Gender</span>
                                                        <span>{r.gender}</span>
                                                    </div>

                                                </div>
                                            ))
                                        }
                                    </>
                                }

                            </div>

                        </div>

                    ))
                }
            </div>
            {
                !loader && <div className="pagination">
                    <button disabled={previous===false} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
                    <button  disabled={next===false} onClick={() => setPage((prev) => prev + 1)}>Next</button>
                </div>
            }

        </div>
    )
}

export default Planet
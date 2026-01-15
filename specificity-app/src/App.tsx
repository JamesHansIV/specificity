import { useState, useEffect } from 'react';

import styles from './App.module.css';

const SPECIES_MAX: number = 1000;
const GENERA_MAX: number = 500;
const FAMILIES_MAX: number = 150;
const ORDERS_MAX: number = 75;
const CLASSES_MAX: number = 5;

interface SpecificityInput {
    species: number;
    genera: number;
    families: number;
    orders: number;
    classes: number;
}

interface SpecificityOutput {
    host_rank: number;
    host_index: number;
}

interface SpecificityResult extends SpecificityInput, SpecificityOutput { };

function App() {
    const [species, setSpecies] = useState<number>(1);
    const [genera, setGenera] = useState<number>(1);
    const [families, setFamilies] = useState<number>(1);
    const [orders, setOrders] = useState<number>(1);
    const [classes, setClasses] = useState<number>(1);

    const [resultsArr, setResultsArr] = useState<SpecificityResult[]>([]);

    const [isInputValid, setIsInputValid] = useState<boolean>(true);

    useEffect(() => {
        validateInput();
    }, [species, genera, families, orders, classes]);

    const validateInput = () => {
        const valid: boolean = !(genera > species || families > genera || orders > families || classes > orders);
        setIsInputValid(valid);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isInputValid)
            return;

        const input: SpecificityInput = { species, genera, families, orders, classes };

        calcSpecificity(input)
            .then((result) => {
                console.log("result", result);
                console.log("Host Rank:", result.host_rank);
                console.log("Host Index:", result.host_index);

                const combinedResult: SpecificityResult = {
                    ...input,
                    ...result
                }

                setResultsArr(prev => [combinedResult, ...prev].slice(0, 50));
            })
            .catch(console.error);
    };

    const calcSpecificity = async (input: SpecificityInput): Promise<SpecificityOutput> => {
        const response = await fetch("https://wkzduipt7e632vgm5v44nhyzcy0npalr.lambda-url.us-east-2.on.aws/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error(`Error calling Lambda: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("data", data);
        return data as SpecificityOutput;
    }

    return (
        <div className={styles.appContainer}>
            <div className={styles.appContent}>
                <div className={styles.headerContainer}>
                    <h3>Host Specificity Index</h3>
                </div>
                <div className={styles.aboutContainer}>
                    <p className={styles.aboutContent}>
                        This site calculates an index of host specificity for parasites based on the number of species, genera, families, orders, and classes in which a species is found. It incorporates the hierarchical information about host distribution included in the Linnean hierarchy, but it is not explcitly tree based. See Caira et al. (in press) for discussion and justification and for examples of the ways in which it can be used.
                    </p>
                    <p className={styles.aboutContent}>
                        Specificity was originally created as a desktop application in 2002 by K. E. Holsinger, and has been adapted for web use by J. Hanselman.
                    </p>
                    {/* <p className={styles.aboutContent}>
                        <strong>Reference: </strong>
                        Caira, J. N., K. Jensen, and K. E. Holsinger. 2003. On a new index of host specificity. In Taxonomy, ecology, and evolution of metazoan parasites, eds. C. Combes and
                        J. Jourdane, vol. 1, pp. 161–201. Presses Universitaire de Perpignan, Perpignan.
                    </p> */}
                </div>

                <div className={styles.contentContainer}>
                    <div className={styles.formContainer}>
                        <h5 className={styles.subHeader}>Calculate Index</h5>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.field}>
                                <label htmlFor="number_of_species">Species:</label>
                                <input
                                    type="number" id="number_of_species"
                                    value={species}
                                    onChange={e => setSpecies(Math.min(Number(e.target.value), SPECIES_MAX))}
                                    min={1} max={SPECIES_MAX}
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="number_of_genera">Genera:</label>
                                <input
                                    type="number" id="number_of_genera"
                                    value={genera}
                                    onChange={e => setGenera(Math.min(Number(e.target.value), GENERA_MAX))}
                                    min={1} max={GENERA_MAX}
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="number_of_families">Families:</label>
                                <input
                                    type="number" id="number_of_families"
                                    value={families}
                                    onChange={e => setFamilies(Math.min(Number(e.target.value), FAMILIES_MAX))}
                                    min={1} max={FAMILIES_MAX}
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="number_of_orders">Orders:</label>
                                <input
                                    type="number" id="number_of_orders"
                                    value={orders}
                                    onChange={e => setOrders(Math.min(Number(e.target.value), ORDERS_MAX))}
                                    min={1} max={ORDERS_MAX}
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="number_of_classes">Classes:</label>
                                <input
                                    type="number" id="number_of_classes"
                                    value={classes}
                                    onChange={e => setClasses(Math.min(Number(e.target.value), CLASSES_MAX))}
                                    min={1} max={CLASSES_MAX}
                                />
                            </div>

                            {!isInputValid && (
                                <p style={{ color: "red" }}>Invalid Input Values!</p>
                            )}

                            <input className={styles.submitButton}
                                type="submit" value="Calculate"
                            />
                        </form>
                    </div>

                    <div className={styles.resultsContainer}>
                        <h5 className={styles.subHeader}>Results</h5>
                        <div className={styles.resultsTableContainer}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>No. species</th>
                                        <th>No. genera</th>
                                        <th>No. families</th>
                                        <th>No. orders</th>
                                        <th>No. classes</th>
                                        <th>Rank</th>
                                        <th>Index <i>(HS)</i></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultsArr.map((r, i) => (
                                        <tr key={i}>
                                            <td>{r.species}</td>
                                            <td>{r.genera}</td>
                                            <td>{r.families}</td>
                                            <td>{r.orders}</td>
                                            <td>{r.classes}</td>
                                            <td>{r.host_rank}</td>
                                            <td>{r.host_index.toFixed(8)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={styles.referenceContainer}>
                        <h5 className={styles.subHeader}>Reference</h5>
                        <div className={styles.referenceContentContainer}>
                            <p>
                                Caira, J. N., K. Jensen, and K. E. Holsinger. 2003. On a new index of host specificity. In Taxonomy, ecology, and evolution of metazoan parasites, eds. C. Combes and J. Jourdane, vol. 1, pp. 161–201. Presses Universitaire de Perpignan, Perpignan.
                            </p>
                            <a className={styles.pdfButtonWrapper} 
                            href={"/CairaJensen&Holsinger2003.pdf"} 
                            target='_blank'>
                                <div className={styles.pdfButton}>
                                    View PDF
                                </div>
                            </a>
                        </div>
                    </div>
                </div>


                <div className={styles.otherTapewormToolsContainer}></div>

                <div className={styles.footerContainer}>

                </div>
            </div>
        </div>
    )
}

export default App

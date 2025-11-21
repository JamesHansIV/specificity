import { useState, useEffect } from 'react';

import styles from './App.module.css';

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

function App() {
    const [species, setSpecies] = useState<number>(1);
    const [genera, setGenera] = useState<number>(1);
    const [families, setFamilies] = useState<number>(1);
    const [orders, setOrders] = useState<number>(1);
    const [classes, setClasses] = useState<number>(1);

    const [hostSpecificity, setHostSpecificity] = useState<SpecificityOutput>();

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
                setHostSpecificity(result);
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
        <>
            <div className={styles.headerContainer}>
                <h1>Host Specificity</h1>
            </div>
            <div className={styles.contentContainer}>
                <form onSubmit={handleSubmit}>
                    <label>
                        Species: 
                        <input type="number"
                            value={species} onChange={e => setSpecies(Number(e.target.value))}
                            min={1} max={1000}
                        />
                    </label>
                    <br />

                    <label>
                        Genera: 
                        <input type="number"
                            value={genera} onChange={e => setGenera(Number(e.target.value))}
                            min={1} max={500}
                        />
                    </label>
                    <br />

                    <label>
                        Families:
                        <input type="number"
                            value={families} onChange={e => setFamilies(Number(e.target.value))}
                            min={1} max={150}
                        />
                    </label>
                    <br />

                    <label>
                        Orders:
                        <input type="number"
                            value={orders} onChange={e => setOrders(Number(e.target.value))}
                            min={1} max={75}
                        />
                    </label>
                    <br />

                    <label>
                        Classes:
                        <input type="number"
                            value={classes} onChange={e => setClasses(Number(e.target.value))}
                            min={1} max={5}
                        />
                    </label>
                    <br />
                    <br />
                    <input type="submit" value="Submit" />
                    {!isInputValid && (
                        <p style={{color:"red"}}>Invalid Input Values!</p>
                    )}
                </form>
                {hostSpecificity && (
                    <div>
                        <p>Host Rank: {hostSpecificity.host_rank}</p>
                        <p>Host Index: {hostSpecificity.host_index.toFixed(8)}</p>
                    </div>
                )}
            </div>
            <div className={styles.footerContainer}>

            </div>
        </>
    )
}

export default App

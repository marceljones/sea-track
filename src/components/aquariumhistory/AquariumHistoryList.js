import React, { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { AquariumHistoryContext } from "./AquariumHistoryProvider"
import { FishContext } from "../fish/FishProvider"
import { AquariumHistoryCard } from "./AquariumHistoryCard"
import { AquariumHistoryForm } from "./AquariumHistoryForm"
import { Card, Container } from "semantic-ui-react"
import "./AquariumHistory.css"

export const AquariumHistoryList = () => {
    const aquariumId = parseInt(window.location.pathname.split("/").pop())

    const { aquariumHistory, getAquariumHistory } = useContext(AquariumHistoryContext)
    const { fish, getFish } = useContext(FishContext)

    const { aquariumHistoryId } = useParams()

    useEffect(() => {
        getAquariumHistory()
            .then(getFish)
    }, [aquariumHistoryId])

    const currentAquariumHistory = aquariumHistory.filter(obj => obj.aquariumId === aquariumId)
    const reversedAquariumHistory = currentAquariumHistory.reverse()

    const mostRecentObj = reversedAquariumHistory[0] // focus on the most recent water change

    const aquariumFish = fish.filter(fish => fish.aquariumId === aquariumId)

    let mostRecentDate // date to handle math
    let warningTime = false // default state of no overdue time warning
    let overdueDays // holds number of days since last water change

    let currentPh // holds pH level from most recent test
    let phLowMax // placeholder for low pH range value
    let phHighMin // placeholder for high pH range value
    let warningPhHigh = false
    let warningPhLow = false

    let currentAmmonia // holds ammonia level from most recent test
    let warningAmmonia = false

    let currentNitrite // holds nitrite level from most recent test
    let warningNitrite = false

    let currentNitrate // holds nitrate level from most recent test
    let warningNitrate = false

    if (mostRecentObj !== undefined && aquariumFish.length > 0) {
        const today = Date.now()
        mostRecentDate = mostRecentObj.testDate // date from most recent water change
        const mostRecentParse = Date.parse(mostRecentDate) // parsing that date

        const timeGap = today - mostRecentParse // time gap in milliseconds
        const twoWeeks = 1209600000 // two weeks in milliseconds

        if (timeGap > twoWeeks) {
            warningTime = true // tell form to display warning
            overdueDays = Math.floor((timeGap - twoWeeks) / (86400 * 1000)) // overdue days
        }

        currentPh = mostRecentObj.pH // set current pH
        currentAmmonia = mostRecentObj.ammonia // set current ammonia
        currentNitrite = mostRecentObj.nitrite // set current nitrite
        currentNitrate = mostRecentObj.nitrate // set current nitrate

        const findPhLow = aquariumFish.reduce(function (res, obj) {
            return (obj.pHLow > res.pHLow) ? obj : res
        })
        phLowMax = findPhLow.pHLow // sets pH floor for aquarium

        const findPhHigh = aquariumFish.reduce(function (res, obj) {
            return (obj.pHHigh < res.pHHigh) ? obj : res
        })
        phHighMin = findPhHigh.pHHigh // sets pH ceiling for aquarium

        if (currentPh < phLowMax) {
            warningPhLow = true // send aler that pH is too low
        } else if (currentPh > phHighMin) {
            warningPhHigh = true // send alert that pH is too high
        }

        if (currentAmmonia > 0.01) {
            warningAmmonia = true // send alert that ammonia is too high
        }

        if (currentNitrite > 0.25) {
            warningNitrite = true // send alert that nitrite is too high
        }
        if (currentNitrate > 0.25) {
            warningNitrate = true // send alert that nitrate is too high
        }
    }

    return (
        <>
            <Container className="aquariumHistory">
                <AquariumHistoryForm
                    warningTime={warningTime}
                    overdueDays={overdueDays}
                    warningPhLow={warningPhLow}
                    warningPhHigh={warningPhHigh}
                    currentPh={currentPh}
                    phLowMax={phLowMax}
                    phHighMin={phHighMin}
                    warningAmmonia={warningAmmonia}
                    warningNitrite={warningNitrite}
                    warningNitrate={warningNitrate}
                />

                {currentAquariumHistory.length > 0 ? <h3>Water Quality History</h3> : ""}
                <Card.Group>
                    {
                        reversedAquariumHistory.map(aquariumHistory => {
                            return <AquariumHistoryCard key={aquariumHistory.id} aquariumHistory={aquariumHistory} />
                        })
                    }
                </Card.Group>
            </Container>
        </>
    )
}
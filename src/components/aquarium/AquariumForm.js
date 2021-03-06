import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { AquariumContext } from "./AquariumProvider"
import { Container, Form } from "semantic-ui-react"
import "./Aquarium.css"

export const AquariumForm = () => {
    const { getAquariums, addAquarium, getAquariumById, editAquarium } = useContext(AquariumContext)

    const [aquarium, setAquarium] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const { aquariumId } = useParams()

    const history = useHistory()

    const handleControlledInputChange = (evt) => {
        const newAquarium = { ...aquarium }
        newAquarium[evt.target.name] = evt.target.value
        setAquarium(newAquarium)
    }

    useEffect(() => {
        getAquariums().then(() => {
            if (aquariumId) {
                getAquariumById(aquariumId)
                    .then(aquarium => {
                        setAquarium(aquarium)
                        setIsLoading(false)
                    })
            } else {
                setIsLoading(false)
            }
        })
    }, [])

    const constructNewAquarium = () => {
        setIsLoading(true)

        if (aquariumId) {
            editAquarium({
                id: aquarium.id,
                name: aquarium.name,
                gal: parseInt(aquarium.size)
            })
                .then(() => history.push(`/aquarium/details/${aquarium.id}`))

        } else {
            addAquarium({
                userId: parseInt(localStorage.getItem("seaTrack_user")),
                name: aquarium.name,
                gal: parseInt(aquarium.size)
            })
                .then(history.push("/"))
        }
    }

    return (
        <Container>
            <Form className="aquariumForm" onSubmit={evt => {
                evt.preventDefault()
                constructNewAquarium()
            }}>
                <h2 className="aquariumForm_title">{aquariumId ? "Edit Aquarium" : "Add Aquarium"}</h2>

                <Form.Field className="aquariumInputs">
                    <Form.Input
                        required
                        label="Aquarium Name"
                        type="text"
                        placeholder="e.g. Living Room Reef"
                        id="aquariumName"
                        name="name"
                        defaultValue={aquarium.name}
                        onChange={handleControlledInputChange}
                    />

                    <Form.Input
                        required
                        label="Tank Size (gal)"
                        type="number"
                        placeholder="e.g. 150"
                        id="aquariumSize"
                        name="size"
                        defaultValue={aquarium.gal}
                        onChange={handleControlledInputChange}
                    />

                    <Form.Button primary className="button__submit" type="submit" disabled={isLoading}>
                        Save
                    </Form.Button>
                </Form.Field>
            </Form>
        </Container>
    )
}
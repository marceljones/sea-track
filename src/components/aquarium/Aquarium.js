import React, { useContext, useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import { AquariumContext } from "./AquariumProvider"
import { Button, Container, Icon, Modal } from "semantic-ui-react"
import { FishList } from "../fish/FishList"
import { FishForm } from "../fish/FishForm"
import "./Aquarium.css"

export const Aquarium = (props) => {
    const { getAquariumById, deleteAquarium } = useContext(AquariumContext)

    const [aquarium, setAquarium] = useState({})
    const [open, setOpen] = React.useState(false)

    const [fishState, setFishState] = useState()

    const { aquariumId } = useParams()

    const history = useHistory()

    useEffect(() => {
        getAquariumById(aquariumId)
            .then((res) => {
                setAquarium(res)
            })
    }, [aquariumId])

    return (
        <Container>
            <section className="aquarium">
                <h2 className="aquarium__name">{aquarium.name}</h2>

                <Button icon circular onClick={() => {
                    history.push(`/aquarium/edit/${aquarium.id}`)
                }}>
                    <Icon name="edit" />
                </Button>

                <Button icon circular onClick={() => {
                    deleteAquarium(aquarium.id)
                        .then(() => {
                            history.push("/")
                        })
                }
                }>
                    <Icon name="delete" />
                </Button>

                <p className="aquarium__size">{aquarium.gal}</p>

                <section className="aquarium__fish">
                    <Modal
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        size="small"
                        trigger={
                            <Button circular>
                                <Icon name="plus" /> Fish
                            </Button>
                        }
                    >
                        <FishForm />
                    </Modal>

                    <FishList />
                </section>
            </section>
        </Container>
    )
}
import "./TableItem.css"
import {ButtonGroup, Dropdown} from "react-bootstrap";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH, faPlay} from "@fortawesome/free-solid-svg-icons";

const ellipsisH = <FontAwesomeIcon icon={faEllipsisH}/>;
const play = <FontAwesomeIcon className={"table-item-container-image-play"} icon={faPlay}/>;

const TableItem = (props: any) => {
    let songData = props.songData;
    let containerDetails;
    let isPlayingNow: boolean = songData.id === props.nowPlayingURL.split("&fileid=")[1]
    if (songData.file_metadata.song_artistid != "" || songData.file_metadata.song_albumid != "" || "song_artistid" in songData.file_metadata || "song_albumid" in songData.file_metadata) {
        if ("song_artistid" in songData.file_metadata) {
            if (songData.file_metadata.song_artistid !== "") {
                containerDetails = props.artistsDataState[songData.file_metadata.song_artistid].artist_name;
            }
        }

        if ("song_artistid" in songData.file_metadata && "song_albumid" in songData.file_metadata) {
            if (songData.file_metadata.song_artistid !== "" && songData.file_metadata.song_albumid !== "") {
                containerDetails += ", "
            }
        }

        if ("song_albumid" in songData.file_metadata) {
            if (songData.file_metadata.song_albumid !== "") {
                containerDetails += props.albumDataState[songData.file_metadata.song_albumid].album_name;
            }
        }
    }

    const toggle = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<any>>((props, ref: any) => (
        <a
            className={"table-item-toggle"}
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                props.onClick(e);
            }}
        >
            {props.children}
            {ellipsisH}
        </a>
    ));

    return (
        <div
            className={isPlayingNow ? "table-item-container-yellow" : "table-item-container"}
            onClick={(event) => {
                props.songItemOnClick(songData, "Play")
            }}>
            <div className={"table-item-container-number"}>{props.position}</div>
            <div className={"table-item-container-image"} style={{backgroundColor: props.imageColor}}>
                <div className={"table-item-container-image-overlay"}></div>
                {play}
            </div>
            <div className={"table-item-container-info"}>
                <div className={"table-item-container-title"}>
                    {("song_title" in songData.file_metadata && songData.file_metadata.song_title !== "") ? songData.file_metadata.song_title : songData.filename}
                </div>
                <div className={"table-item-container-details"}>{containerDetails}</div>
            </div>
            <div className={"table-item-container-actions"}>
                <Dropdown
                    as={ButtonGroup}
                    onClick={(evt: any) => {
                        evt.stopPropagation();
                    }}
                >
                    {/*<Button*/}
                    {/*    id="Play"*/}
                    {/*    onClick={(event) =>*/}
                    {/*        props.songItemOnClick(songData, "Play")*/}
                    {/*    }*/}
                    {/*    variant="success"*/}
                    {/*>*/}
                    {/*    Play*/}
                    {/*/Button>*/}

                    <Dropdown.Toggle
                        as={toggle}
                        variant="success"
                        id="dropdown-split-basic"
                    />

                    <Dropdown.Menu>
                        <Dropdown.Item
                            id="AddToQ"
                            onClick={(event) =>
                                props.songItemOnClick(songData, "AddToQ")
                            }
                        >
                            Add to queue
                        </Dropdown.Item>
                        <Dropdown.Item
                            id="PlayNext"
                            onClick={(event) =>
                                props.songItemOnClick(songData, "PlayNext")
                            }
                        >
                            Play next
                        </Dropdown.Item>
                        <Dropdown.Item
                            id="AddToPlaylist"
                            onClick={(event) =>
                                props.songItemOnClick(songData, "AddToPlaylist")
                            }
                        >
                            Add to playlist
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};

export default TableItem;
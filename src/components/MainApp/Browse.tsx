// import ReactDOM from 'react-dom'
import React, { forwardRef, useState, useEffect } from "react";
import { GenericProps } from "../../interface/GenericProps";
import { Route } from "react-router";
import CategoriesTopBar from "../../components/MainApp/CategoriesTopBar";
import { CategoriesTopBarItemProps } from "../../interface/components/MainApp/CategoriesTopBarItemProps";
import useAxios from "axios-hooks";
import "./Browse.css";
import * as BrowseSubPage from "./BrowseSubPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MaterialTable, { MTableBodyRow } from "material-table";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";

import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import MoreVert from "@material-ui/icons/MoreVert";

// import PlayArrow from "@material-ui/icons/PlayArrow";
// import Queue from "@material-ui/icons/Queue";

import { Icons } from "material-table";
// import MusicPlayerContext from "../../context/MusicPlayerContext";
import { MusicQueueItem } from "../../interface/context/MusicQueueItem";

const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => (
        <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

interface Element {}

function Browse(props: any): JSX.Element {
    // const {
    //     status,
    //     setStatus,
    //     nowPlayingURL,
    //     setNowPlayingURL,
    //     progress,
    //     setProgress,
    //     volume,
    //     setVolume,
    //     queue,
    //     setQueue,
    // } = React.useContext(MusicPlayerContext);

    const song_columns = [
        { title: "file_id", field: "id", hidden: true },
        { title: "Title", field: "file_metadata.song_title" },
        { title: "Artist", field: "file_metadata.song_artist" },
        { title: "Album", field: "file_metadata.song_album" },
    ];

    const [topBarSelection, setTopBar] = useState(0);
    const [tableData, setTableData] = useState<any>([]);
    const [pageLoading, setPageLoading] = useState(true);

    const [
        {
            data: indexFilesData,
            loading: indexFilesLoading,
            error: indexFilesError,
        },
        indexFilesRefetch,
    ] = useAxios({
        url: "/api/indexes/files",
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.token}`,
        },
    });

    let items: Array<CategoriesTopBarItemProps> = [
        {
            display_text: "All songs",
            faIconClass: "music",
            link: "/app/AllSongs",
        },
        {
            display_text: "Artists",
            faIconClass: "users",
            link: "/app/Artists",
        },
        {
            display_text: "Genres",
            faIconClass: "guitar",
            link: "/app/Genres",
        },
        {
            display_text: "Albums",
            faIconClass: "compact-disc",
            link: "/app/Albums",
        },
    ];

    useEffect(() => {
        if (indexFilesLoading || indexFilesError || !pageLoading) return;

        let indexFiles = Object.values(indexFilesData.files);
        setPageLoading(false);
        setTableData(indexFiles);
    }, [indexFilesData, indexFilesLoading, indexFilesError, pageLoading]);

    const play = (event: any, rowData: any) => {
        let new_queue: Array<MusicQueueItem> = [];
        // Set queue to all songs in view
        for (let i = 0; i < tableData.length; i++) {
            new_queue.push({
                item_id: "queue_item_" + tableData[i].tableData.id,
                current:
                    tableData[i].tableData.id === rowData.tableData.id
                        ? true
                        : false,
                playingURL: `/api/driveapi/files/download?token=${localStorage.token}&fileid=${tableData[i].id}`,
                song_title: tableData[i].file_metadata.song_title,
                song_artist: tableData[i].file_metadata.song_artist,
            });
        }
        props.setQueue(new_queue);
        props.setProgress(0);
        props.setNowPlayingURL(
            `/api/driveapi/files/download?token=${localStorage.token}&fileid=${rowData.id}`
        );
        props.setSongTitleLabel(rowData.file_metadata.song_title);
        props.setSongArtistLabel(rowData.file_metadata.song_artist);
        // setSongAlbumArtURL("");
        props.setStatus("PLAYING");

        // console.log(rowData);
        // window.alert(
        //     "You clicked on " +
        //         (rowData as any).title +
        //         " Action: " +
        //         event.currentTarget.id
        // );
    };
    const addToPlaylist = (event: any, rowData: any) => {};
    const playNext = (event: any, rowData: any) => {};
    const addToQ = (event: any, rowData: any) => {
        props.setQueue([
            ...props.queue,
            {
                item_id:
                    "queue_item_" +
                    rowData.tableData.id +
                    Date.now().toString(),
                current: false,
                playingURL: `/api/driveapi/files/download?token=${localStorage.token}&fileid=${rowData.id}`,
                song_title: rowData.file_metadata.song_title,
                song_artist: rowData.file_metadata.song_artist,
            },
        ]);
    };

    const matTableActionOnClick = (event: any, rowData: any) => {
        // const possibleAction = ["addToQ", "playNext", "addToPlaylist", "play"];
        switch (event.currentTarget.id) {
            case "addToQ":
                addToQ(event, rowData);
                break;
            case "playNext":
                playNext(event, rowData);
                break;
            case "addToPlaylist":
                addToPlaylist(event, rowData);
                break;
            case "play":
                play(event, rowData);
                break;
        }
    };

    return (
        <div
            className="container-fluid mainapp-content-container"
            style={{ color: "#ffffff" }}
        >
            <div className="row content-top-bar col-12">
                {/* Only show when screen size is small */}
                {/* <div className="d-sm-block d-md-none col-sm-2 col-12">
                    <div
                        style={{ padding: "10px", cursor: "pointer" }}
                        onClick={() => props.setNavBar(!props.navBarState)}
                    >
                        <FontAwesomeIcon icon="align-justify" />
                    </div>
                </div> */}
                <div className="organizer-body">
                    <CategoriesTopBar items={items} />
                    <Route
                        path="/app"
                        exact
                        component={() => (
                            <div>Select one of the categories</div>
                        )}
                    />
                    <Route
                        path="/app/AllSongs"
                        component={() => (
                            <BrowseSubPage.BrowseAllSongs className="row organizer-subpage-content-container" />
                        )}
                    />
                    <Route
                        path="/app/Artists"
                        component={() => (
                            <BrowseSubPage.BrowseArtists className="row organizer-subpage-content-container" />
                        )}
                    />
                    <Route
                        path="/app/Genres"
                        component={BrowseSubPage.BrowseGenres}
                    />
                    <Route
                        path="/app/Albums"
                        component={BrowseSubPage.BrowseAlbums}
                    />
                </div>
                {/* <div
                    className="songs-section"
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    <MaterialTable
                        icons={tableIcons}
                        columns={song_columns}
                        data={tableData}
                        title="Songs"
                        actions={[
                            {
                                icon: MoreVert,
                                tooltip: "More Options",
                                onClick: matTableActionOnClick,
                            },
                        ]}
                        components={{
                            Action: (props) => (
                                <Dropdown
                                    as={ButtonGroup}
                                    onClick={(evt: any) => {
                                        evt.stopPropagation();
                                    }}
                                >
                                    <Button
                                        id="play"
                                        onClick={(event) =>
                                            props.action.onClick(
                                                event,
                                                props.data
                                            )
                                        }
                                        variant="success"
                                    >
                                        Play
                                    </Button>

                                    <Dropdown.Toggle
                                        split
                                        variant="success"
                                        id="dropdown-split-basic"
                                    />

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            id="addToQ"
                                            onClick={(event) =>
                                                props.action.onClick(
                                                    event,
                                                    props.data
                                                )
                                            }
                                        >
                                            Add to queue
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            id="playNext"
                                            onClick={(event) =>
                                                props.action.onClick(
                                                    event,
                                                    props.data
                                                )
                                            }
                                        >
                                            Play next
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            id="addToPlaylist"
                                            onClick={(event) =>
                                                props.action.onClick(
                                                    event,
                                                    props.data
                                                )
                                            }
                                        >
                                            Add to playlist
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ),
                        }}
                        options={{
                            actionsColumnIndex: -1,
                        }}
                        onRowClick={(e, rowData) => {
                            play(e, rowData);
                        }}
                    />
                </div> */}
            </div>
        </div>
    );
}
export default React.memo(Browse);
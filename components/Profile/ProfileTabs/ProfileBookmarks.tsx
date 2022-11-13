import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { sortingCompareFn } from "../../../utils/profile";
import ContentItem from "./ContentItem";

interface IProps {
  user: User;
}

const ProfileBookmarks = ({ user }: IProps) => {
  const { bookmarks, blocks } = user;
  const [rawNotes, setRawNotes] = useState<Note[] | null>(null);
  const [sortedNotes, setSortedNotes] = useState<Note[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("latest");

  const handleSortByOnChange = useCallback((event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  }, []);

  const handleOrderOnChange = useCallback((event: SelectChangeEvent) => {
    setOrder(event.target.value);
  }, []);

  const handlePageOnChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setCurrentPage(value);
    },
    []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    (async function getNotes() {
      const {
        data: { notes },
      } = await axios.get("http://localhost:3000/api/notes", {
        params: { value: bookmarks },
      });
      setRawNotes(notes.filter((note: Note) => note.public && !blocks.includes(note.userId)));
    })();
  }, []);

  useEffect(() => {
    if (rawNotes) {
      setSortedNotes([
        ...rawNotes
          .filter((rawNote) => rawNote.public)
          .sort((a: Note, b: Note) => {
            return sortingCompareFn(a, b, sortBy, order);
          }),
      ]);
    }
  }, [rawNotes, sortBy, order]);

  if (rawNotes && rawNotes.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          pt: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "inherit",
            fontWeight: "bold",
            mb: 2,
            fontSize: 20,
          }}
        >
          You have not bookmarked any note yet!
        </Typography>
        <Image src="/no_data.jpg" width={900} height={500} />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1,
          py: 1.5,
          position: "sticky",
          top: 112,
          bgcolor: "rgb(241, 242, 242)",
          zIndex: 99,
        }}
      >
        <Typography>
          {(currentPage - 1) * 8 + 1} -{" "}
          {Math.min(currentPage * 8, sortedNotes.length)} of{" "}
          {sortedNotes.length} results (Only currently public notes are
          displayed)
        </Typography>
        <Box>
          <FormControl sx={{ mr: 1 }} size="small">
            <InputLabel id="sortBy">Sort by</InputLabel>
            <Select
              labelId="sortBy"
              id="sortBy"
              value={sortBy}
              label="Sort by"
              onChange={handleSortByOnChange}
              autoWidth
            >
              <MenuItem value="createdAt">Creation Time</MenuItem>
              <MenuItem value="lastModified">Last Modification Time</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel id="Order">Order</InputLabel>
            <Select
              labelId="Order"
              id="Order"
              value={order}
              label="Order"
              onChange={handleOrderOnChange}
              autoWidth
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ mb: 3 }}>
        {sortedNotes.map((sortedNote, index) => {
          if (
            index >= (currentPage - 1) * 8 &&
            index < Math.min(currentPage * 8, sortedNotes.length)
          ) {
            return <ContentItem note={sortedNote} key={sortedNote._id} />;
          }
        })}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Pagination
          count={Math.ceil(sortedNotes.length / 8)}
          color="primary"
          page={currentPage}
          onChange={handlePageOnChange}
        />
      </Box>
    </Box>
  );
};

export default ProfileBookmarks;


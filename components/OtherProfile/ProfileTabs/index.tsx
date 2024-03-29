import { Tabs, Tab, Box } from "@mui/material";
import dynamic from "next/dynamic";
const ProfileFollowers = dynamic(() => import("./ProfileFollowers"));
const ProfileFollowing = dynamic(() => import("./ProfileFollowing"));
const ProfileNotes = dynamic(() => import("./ProfileNotes"));
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface ProfileTabsProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  tabValue: number;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
  otherUser: User;
}

const ProfileTabs = ({
  user,
  setUser,
  tabValue,
  setTabValue,
  otherUser,
}: ProfileTabsProps) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          height: "6vh",
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: '9vh',
          bgcolor: "rgb(241, 242, 242)",
          zIndex: 99,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{}}
        >
          <Tab label="Notes" {...a11yProps(0)} sx={{ textTransform: "none" }} />
          <Tab
            label="Followers"
            {...a11yProps(1)}
            sx={{ textTransform: "none" }}
          />
          <Tab
            label="Following"
            {...a11yProps(2)}
            sx={{ textTransform: "none" }}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <ProfileNotes user={user} otherUser={otherUser} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ProfileFollowers user={user} setUser={setUser} otherUser={otherUser} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ProfileFollowing user={user} setUser={setUser} otherUser={otherUser} />
      </TabPanel>
    </Box>
  );
};

export default ProfileTabs;

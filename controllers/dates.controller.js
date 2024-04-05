export const getPaginatedDates = (req, res) => {
    res.send("paginated dates")
}

/*
// Express route to handle the request
app.get('/randomUsers/:city', async (req, res) => {
  const city = req.params.city;
  
  try {
    // Fetch 10 random users from the specified city excluding already selected users
    const users = await User.aggregate([
      { $match: { city: city, _id: { $nin: selectedUserIds } } },
      { $sample: { size: 10 } }
    ]);

    // Extract the IDs of selected users and add them to the array
    const selectedIds = users.map(user => user._id);
    selectedUserIds = selectedUserIds.concat(selectedIds);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
*/
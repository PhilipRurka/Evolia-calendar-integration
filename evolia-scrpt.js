(async () => {
  try {
    const AuthResponse = await fetch("https://api.evolia.com/v1/auth/console/login", {
      method: "POST",
      body: JSON.stringify({
        password: "________________________________",
        userName: "hey@philiprurka.com",
        validateMfa: true
      })
    })

    const authRes = await memberResponse.json();

    console.log(JSON.stringify(authRes, null, 2))

    const memberResponse = await fetch("https://api.evolia.com/v1/groups/3b2c2c9f29dc03669faa145358ee18b4/events/grouped/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer _______________________________________________",
        "x-evo-platform": "EVOLIA",
        "x-evo-timezone": "America/Toronto",
        "x-evo-version": "9.10.3"
      },
      body: JSON.stringify({
        forMemberIds: ["6716723a2549d8c8451ef067"],
        locale: "en",
        fromDate: Date.now(),
        toDate: fromDate + 7 * 24 * 60 * 60 * 1000, // 7 days from now,
        groupBy: "member",
        sortBy: "name",
        includeClockingDescriptions: true,  
        includeInterested: true,  
        includeNonWorkingMembers: true,  
        simplified: true,  
        withCoworkers: false,  
        withInvites: true,  
        withStats: false  
      })
    });

    const memberRes = await memberResponse.json();

    const shifts = memberRes.struct[1].children;
    const locations = {};
    const subLocations = {};
    const skills = {};

    memberRes.data.locations.forEach((item) => {
      locations[item._id] = item.locData.abbrev;
    });

    memberRes.data.subLocations.forEach((item) => {
      subLocations[item._id] = item.names.fr;
    });

    memberRes.data.skills.forEach((item) => {
      skills[item._id] = item.abbrev;
    });

    const shiftDetails = shifts.map((item) => ({
      endsAt: item.endsAt,
      note: item.note,
      location: locations[item.locationId] || "Unknown",
      subLocations: subLocations[item.subLocationId] || "Unknown",
      skill: skills[item.skillId] || "Unknown",
      startsAt: item.startsAt,
    }));

    console.log("Shifts Fetched:", shiftDetails);

    // Authenticate and Save to Google Calendar

  } catch (error) {
    console.error("❌ API Request Failed:", error);
  }
})();

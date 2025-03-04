const { db } = require("../db/db.js");

exports.insertJobAds = async (data) => {
  for (const row of data) {
    const {
      job_title,
      job_company,
      job_url,
      deadline,
      description,
      refer_phone,
      refer_email,
      refer_full_name,
      skills,
    } = row;

    // 1️⃣ Insert job_ad and get generated job_id
    const jobAdResult = await db.query(
      `INSERT INTO job_ads (job_title, job_company, job_url, deadline, description, refer_phone, refer_email, refer_full_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (job_url) DO NOTHING RETURNING id`,
      [
        job_title,
        job_company,
        job_url,
        deadline,
        description,
        refer_phone,
        refer_email,
        refer_full_name,
      ]
    );

    // If job wasn't inserted (duplicate job_url), skip it
    if (!jobAdResult.rows.length) continue;
    const jobId = jobAdResult.rows[0].id;

    // 2️⃣ Process skills
    const skillList = skills.split(",").map((s) => s.trim());

    for (const skill of skillList) {
      let skillId;

      // Check if skill already exists
      const skillResult = await db.query(
        `SELECT id FROM skills WHERE skill_name = $1`,
        [skill]
      );

      if (skillResult.rows.length > 0) {
        skillId = skillResult.rows[0].id;
      } else {
        // Insert new skill and get its generated ID
        const newSkill = await db.query(
          `INSERT INTO skills (skill_name, category_skills) VALUES ($1, 'General') RETURNING id`,
          [skill]
        );
        skillId = newSkill.rows[0].id;
      }

      // 3️⃣ Link job_ad and skill in job_skills
      await db.query(
        `INSERT INTO job_skills (job_id, skills_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [jobId, skillId]
      );
    }
  }
};

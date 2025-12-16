import { test, expect } from '@playwright/test';

test('signup', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Redirect to signup page when no account
  // Also confirms that clangen loaded successfully
  await expect(page).toHaveURL(/signup/, { timeout: 30 * 1000 });
  await expect(page).toHaveTitle("Welcome! | ClanGen Simulator");

  // entered create new clan page
  await page.getByRole("link", { name: "Create New Clan" }).click();
  await expect(page).toHaveTitle("New Clan | ClanGen Simulator");

  // sign up
  await page.locator("#clan-name-input").fill("Test");

  // select cats
  const leader = page.locator("[name='leader']");
  const deputy = page.locator("[name='deputy']");
  const med = page.locator("[name='med']");

  await leader.selectOption({ index: 1 });
  await deputy.selectOption({ index: 1 });
  await med.selectOption({ index: 1 });

  const leaderName: string = await leader.evaluate("el => el.options[el.selectedIndex].text");
  const deputyName: string = await deputy.evaluate("el => el.options[el.selectedIndex].text");
  const medName: string = await med.evaluate("el => el.options[el.selectedIndex].text");

  // submit
  await page.getByRole("button", { name: "Submit" }).click();

  const profileInfo = page.locator(".profile-info").first();
  await profileInfo.waitFor();

  // loaded ok?
  await expect(profileInfo).toHaveText(/TestClan/);
  await expect(profileInfo).toHaveText(/Newleaf/);
  await expect(profileInfo).toHaveText(/0 moons/);

  // correct page? 
  await expect(page).toHaveURL("http://localhost:5173/cats?category=clan_cats");

  // selected cats ok?
  const catsList = page.locator(".cats-list").first();
  await expect(catsList).toHaveText(RegExp(deputyName));
  await expect(catsList).toHaveText(RegExp(medName));

  // check that it saved
  await page.reload();
  await expect(profileInfo).toHaveText(/TestClan/);
  await expect(profileInfo).toHaveText(/Newleaf/);
  await expect(profileInfo).toHaveText(/0 moons/);
});

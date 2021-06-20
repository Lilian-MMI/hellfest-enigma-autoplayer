const puppeteer = require('puppeteer');
const notifier = require('node-notifier');

const baseURL = 'https://www.hellfest-enigma.fr/';

const openTo = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                headless: false
            });
            const page = await browser.newPage();
            await page.goto(`${baseURL}`, {
                waitUntil: 'networkidle0'
            }).then(() => console.log('Ouverture du site avec succès !'))
            resolve([page, browser]);
        } catch (err) {
            console.log('Incapacité de joindre le site web.');
        }
    })
}

const clickOnEveryItems = async () => {
    const [page, browser] = await openTo();
    let items = [];
    for (let index = 1; index < 51; index++) {
        items.push(`#Stage_sceneMob_bt${index}_zone`);
    }
    return new Promise(async (resolve, reject) => {
        try {
            for await (const i of [...Array(10000).keys()]) {
                await page.waitForSelector('#Stage_CTA_intro_Rectangle').then(async () => await page.waitForTimeout(2000));
                await page.click('#Stage_CTA_intro_Rectangle').then(async () => await page.waitForTimeout(12000));

                for await (const item of items) {
                    await page.waitForSelector(item);
                    await page.click(item).then(async () => await page.waitForTimeout(1500)).catch(() => new Error('Item not found'));
                    await page.click('#Stage_indice_indice_bg__Rectangle').then(async () => await page.waitForTimeout(750));
                    item === `#Stage_sceneMob_bt45_zone` ? console.log('\x1b[31m%s\x1b[0m', `Récupération de l'indice 45 -> instant gagnant ??`) : console.log(`Récupération de l'indice: ${item}`);
                }
                console.log('\x1b[36m%s\x1b[0m', 'Jeu terminé !');
                await page.waitForSelector('#Stage_indice_replayBT').then(async () => await page.waitForTimeout(3000));
                await page.click('#Stage_indice_replayBT').then(() => console.log(`Le jeu devrait se relancer...`));
            }

            resolve([items, browser]);
        } catch (err) {
            console.log(`Un problème est survenu sur le site: ${err.message}`)
            await page.waitForTimeout(3000);
            if (err.message !== `Item not found`) {
                await browser.close();
            }
            clickOnEveryItems();
        }
    })
}

clickOnEveryItems();
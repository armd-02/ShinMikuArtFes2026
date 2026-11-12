const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const parse = file => vm.runInNewContext('(' + fs.readFileSync(file, 'utf8') + ')');
const config = parse('data/config-user.jsonc');
const forms = parse('data/config-activities.jsonc').activities;
const labels = { ...parse('data/glot-system.jsonc'), ...parse('data/glot-custom.jsonc') };
const columns = parse('data/listtable.jsonc').list.columns;
assert.equal(config.static.use, true);
assert.deepEqual(Array.from(config.map.viewCenter), [135.49237, 34.73928]);
assert.equal(config.poiView.poiFilter, 'filter');
assert.equal(config.listTable.category, 'activity');
assert.equal(config.listTable.allActs, true);
assert.equal(config.activity.authMode, 'basic');
assert.equal(config.activity.url, 'https://armd-01.sakura.ne.jp/community-mapmaker-backend/api/activities.php?app=shinmikuartfes2026');
assert.equal(config.etc.localSave, 'ShinMikuArtFes2026');
assert.equal(config.etc.editMode, false);
assert.equal(config.etc.editModeSwitch, false);
assert.equal(config.feature3d.use, false);
assert.equal(config.indoor.use, false);
assert.equal(columns.actFields[0], 'id', 'multiple artworks at one venue must retain distinct IDs');
assert.equal(columns.style.length, columns.actFields.length - 1);
assert.ok(forms.ShinMikuArtFes2026, '2026 form is available for a future source');
assert.ok(forms.ShinMiku, 'backend IDs resolve to the event detail form');
for (const form of Object.values(forms)) for (const field of Object.values(form.form)) {
    assert.ok(labels[field.glot], `translation for ${field.glot}`);
}
for (const col of columns.style) if (col.glotName) assert.ok(labels[col.glotName]);
assert.equal(labels.site_title.ja, '新大阪・三国アートフェスマップ2026');
for (const file of [...config.static.osmjsons, config.etc.splashUrl, config.listTable.backgroundImage]) assert.ok(fs.existsSync(file), file);
const manifest = parse('manifest.json');
for (const file of [...manifest.styles, ...manifest.scripts || [],
    ...(manifest.scriptGroups || []).flatMap(group => group.scripts),
    ...Object.values(manifest.lazyScriptGroups || {}).flatMap(group => group.scripts)]) {
    if (!/^https?:/.test(file)) assert.ok(fs.existsSync(file), file);
}
console.log('PASS: 2026 configuration, legacy form compatibility, list identity, labels and local assets');

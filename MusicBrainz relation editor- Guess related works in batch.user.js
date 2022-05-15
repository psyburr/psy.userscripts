/* global $ MB requests helper server relEditor */
'use strict';
// ==UserScript==
// @name         MusicBrainz relation editor: Guess related works in batch
// @namespace    mbz-loujine
// @author       loujine
// @version      2022.1.28
// @downloadURL  https://raw.githubusercontent.com/loujine/musicbrainz-scripts/master/mb-reledit-guess_works.user.js
// @updateURL    https://raw.githubusercontent.com/loujine/musicbrainz-scripts/master/mb-reledit-guess_works.user.js
// @supportURL   https://github.com/loujine/musicbrainz-scripts
// @icon         https://raw.githubusercontent.com/loujine/musicbrainz-scripts/master/icon.png
// @description  musicbrainz.org relation editor: Guess related works in batch
// @compatible   firefox+tampermonkey
// @license      MIT
// @require      https://raw.githubusercontent.com/loujine/musicbrainz-scripts/master/mbz-loujine-common.js
// @include      http*://*musicbrainz.org/release/*/edit-relationships
// @grant        none
// @run-at       document-end
// ==/UserScript==

const MBID_REGEX = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
const repeatHelp = `Ways to associate subworks SW1, SW2, SW3... with selected tracks T1, T2, T3...
    1,1,1 (or empty) -> SW1 on T1, SW2 on T2, SW3 on T3...
    1,0,1 -> SW1 on T1, SW2 skipped, SW3 on T2...
    1,2,1 -> SW1 on T1, SW2 on T2 and T3 (as partial); SW3 on T4...
    1,-1,1 -> SW1 and SW2 on T1, SW3 on T2...
`;

function setWork(recording, work, partial) {
    requests.GET(`/ws/js/entity/${work.gid}?inc=rels`, function (resp) {
        const target = JSON.parse(resp);
        const dialog = new MB.relationshipEditor.UI.AddDialog({
            source: recording,
            target: target,
            viewModel: MB.releaseRelationshipEditor,
        });
        target.relationships.forEach(rel => {
            // apparently necessary to fill MB.entityCache with rels
            MB.getRelationship(rel, target);
        });

        if (partial) {
            dialog.relationship().setAttributes([{
                // 'partial' attribute, id 579
                type: {gid: "d2b63be6-91ec-426a-987a-30b47f8aae2d"}
            }]);
        }
        dialog.accept();
    });
}

function replaceWork(recording, work, rel) {
    requests.GET(`/ws/js/entity/${work.gid}?inc=rels`, function (resp) {
        const target = JSON.parse(resp);
        const dialog = new MB.relationshipEditor.UI.EditDialog({
            source: recording,
            relationship: rel,
            viewModel: MB.releaseRelationshipEditor,
        });
        target.relationships.forEach(rel => {
            // apparently necessary to fill MB.entityCache with rels
            MB.getRelationship(rel, target);
        });
        dialog.relationship().entities([
            MB.entity({entityType: 'recording', gid: recording.gid}),
            MB.entity({entityType: 'work', gid: work.gid}),
        ]);
        dialog.accept();
    });
}

function guessWork() {
    let idx = 0;
    MB.relationshipEditor.UI.checkedRecordings().forEach(recording => {
        const url =
            '/ws/js/work/?q=' +
            encodeURIComponent(document.getElementById('prefix').value) +
            ' ' +
            encodeURIComponent(recording.name) +
            '&artist=' +
            encodeURIComponent(recording.artist) +
            '&fmt=json&limit=1';
        if (!recording.performances().length) {
            idx += 1;
            setTimeout(function () {
                requests.GET(url, function (resp) {
                    setWork(recording, JSON.parse(resp)[0]);
                });
            }, idx * server.timeout);
        }
    });
}

function autoComplete() {
    const $input = $('input#mainWork');
    const match = $input.val().match(MBID_REGEX);
    if (match) {
        const mbid = match[0];
        requests.GET(`/ws/2/work/${mbid}?fmt=json`, function (data) {
            data = JSON.parse(data);
            $input.data('mbid', mbid);
            $input.val(data.title || data.name);
            $input.css('background', '#bbffbb');
        });
    } else {
        $input.css('background', '#ffaaaa');
    }
}

function fetchSubWorks(workMbid, replace) {
    replace = replace || false;
    if (workMbid.split('/').length > 1) {
        workMbid = workMbid.split('/')[4];
    }
    requests.GET(`/ws/js/entity/${workMbid}?inc=rels`, function (resp) {
        let repeats = document.getElementById('repeats').value.trim();
        const subWorks = helper.sortSubworks(JSON.parse(resp));
        let total = subWorks.length;
        if (repeats) {
            repeats = repeats.split(/[,; ]+/).map(s => Number.parseInt(s));
            total = repeats.reduce((n, m) => Math.max(n,0) + Math.max(m,0), 0);
        } else {
            repeats = subWorks.map(() => 1);
        }
        const repeatedSubWorks = Array(total);
        const partialSubWorks = Array(total);
        let start = 0;
        subWorks.forEach((sb, sbIdx) => {
            if (repeats[sbIdx] < 0) {
                repeatedSubWorks[start-1].push(sb);
                partialSubWorks.fill(false, start-1, start);
                // start += repeats[sbIdx];
            } else {
                repeatedSubWorks.fill([sb], start, start + repeats[sbIdx]);
                partialSubWorks.fill(
                    repeats[sbIdx] > 1 ? true : false, start, start + repeats[sbIdx]);
                start += repeats[sbIdx];
            }
        });
        MB.relationshipEditor.UI.checkedRecordings().forEach(
            (recording, recIdx) => {
                if (recIdx >= repeatedSubWorks.length) {
                    return;
                }
                repeatedSubWorks[recIdx].map(subw => {
                    if (replace && recording.performances().length) {
                        replaceWork(recording, subw, recording.performances()[0]);
                    } else if (!recording.performances().length) {
                        setWork(recording, subw, partialSubWorks[recIdx]);
                    }
                });
            }
        );
    });
}


(function displayToolbar() {
    relEditor.container(document.querySelector('div.tabs'))
             .insertAdjacentHTML('beforeend', `
      <details open="">
        <summary style="display: block;margin-left: 8px;cursor: pointer;">
          <h3 style="display: list-item;">
            Search for works
          </h3>
        </summary>
        <div>
          <span>
            <abbr title="You can add an optional prefix (e.g. the misssing parent
            work name) to help guessing the right work">prefix</abbr>:&nbsp;
          </span>
          <input type="text" id="prefix" value="" placeholder="optional">
          <br />
          <input type="button" id="searchWork" value="Guess works">
          <br />
          <h3>Link to parts of a main Work</h3>
          <p>
            Fill the main work mbid to link selected recordings to (ordered) parts of the work.
          </p>
          <span>
            Repeats:&nbsp;
          </span>
          <input type="text" id="repeats" placeholder="n1,n2,n3... (optional)">
          <span title="${repeatHelp}">🛈</span>
          <br />
          <label for="replaceSubworks">Replace work if pre-existing:&nbsp;</label>
          <input type="checkbox" id="replaceSubworks">
          <br />
          <span>Main work name:&nbsp;</span>
          <input type="text" id="mainWork" placeholder="main work mbid">
          <input type="button" id="fetchSubworks" value="Load subworks">
        </div>
      </details>
    `);
})();


$(document).ready(function() {
    let appliedNote = false;
    document.getElementById('searchWork').addEventListener('click', () => {
        guessWork();
        if (!appliedNote) {
            relEditor.editNote(GM_info.script, 'Set guessed works');
            appliedNote = true;
        }
    });
    $('input#mainWork').on('input', autoComplete);
    document.querySelector('input#fetchSubworks').addEventListener('click', () => {
        fetchSubWorks(
            $('input#mainWork').data('mbid'),
            document.querySelector('input#replaceSubworks').checked
        );
        if (!appliedNote) {
            relEditor.editNote(GM_info.script, 'Set guessed subworks');
            appliedNote = true;
        }
    });
    return false;
});

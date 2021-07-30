const htmlToNode = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  const icon = div.firstChild;
  div.removeChild(icon);
  return icon;
}

const CHANGED_ICON = `<svg class="octicon octicon-diff-modified groot-change-icon" title="modified" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.75 2.5h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75a.25.25 0 01.25-.25zM13.25 1H2.75A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1zM8 10a2 2 0 100-4 2 2 0 000 4z"></path></svg>`;
const ADDED_ICON = `<svg class="octicon octicon-diff-added groot-add-icon" title="added" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.25 2.5H2.75a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25zM2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 15H2.75A1.75 1.75 0 011 13.25V2.75C1 1.784 1.784 1 2.75 1zM8 4a.75.75 0 01.75.75v2.5h2.5a.75.75 0 010 1.5h-2.5v2.5a.75.75 0 01-1.5 0v-2.5h-2.5a.75.75 0 010-1.5h2.5v-2.5A.75.75 0 018 4z"></path></svg>`;
const DELETED_ICON = `<svg class="octicon octicon-diff-removed groot-delete-icon" title="removed" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.75 2.5h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75a.25.25 0 01.25-.25zM13.25 1H2.75A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1zm-2 7.75a.75.75 0 000-1.5h-6.5a.75.75 0 000 1.5h6.5z"></path></svg>`;
const RENAMED_ICON = `<svg class="octicon octicon-diff-renamed groot-rename-icon" title="renamed" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.75 2.5h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75a.25.25 0 01.25-.25zM13.25 1H2.75A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1zm-1.47 7.53a.75.75 0 000-1.06L8.53 4.22a.75.75 0 00-1.06 1.06l1.97 1.97H4.75a.75.75 0 000 1.5h4.69l-1.97 1.97a.75.75 0 101.06 1.06l3.25-3.25z"></path></svg>`;
const CLOSED_DIR_ICON = `<svg class="octicon" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M2 4.75C2 3.784 2.784 3 3.75 3h4.971c.58 0 1.12.286 1.447.765l1.404 2.063a.25.25 0 00.207.11h8.471c.966 0 1.75.783 1.75 1.75V19.25A1.75 1.75 0 0120.25 21H3.75A1.75 1.75 0 012 19.25V4.75z"></path></svg>`;
const OPEN_DIR_ICON = `<svg class="octicon" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M3.75 4.5a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h16.5a.25.25 0 00.25-.25V7.687a.25.25 0 00-.25-.25h-8.471a1.75 1.75 0 01-1.447-.765L8.928 4.61a.25.25 0 00-.208-.11H3.75zM2 4.75C2 3.784 2.784 3 3.75 3h4.971c.58 0 1.12.286 1.447.765l1.404 2.063a.25.25 0 00.207.11h8.471c.966 0 1.75.783 1.75 1.75V19.25A1.75 1.75 0 0120.25 21H3.75A1.75 1.75 0 012 19.25V4.75z"></path></svg>`;
const LOADING_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" r="32" stroke-width="8" stroke="#82bbe4" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"/></circle></svg>`;

const cleanupFns = [];
let waitForFilesTimer = null;
function initializePRHooks() {
  while (cleanupFns.length) cleanupFns.pop()();

  clearTimeout(waitForFilesTimer);
  const files = document.querySelector('#files');
  if (!files) {
    waitForFilesTimer = setTimeout(initializePRHooks, 100);
    return;
  }

  const reviewContainer = document.createElement('div');
  reviewContainer.classList.add('review-container');
  const stickyContainer = document.createElement('div');
  stickyContainer.classList.add('sticky-groot');
  const treeContainer = document.createElement('div');
  treeContainer.classList.add('groot', 'text-small', 'text-mono');

  stickyContainer.appendChild(treeContainer);
  reviewContainer.appendChild(stickyContainer);

  files.parentElement.insertBefore(reviewContainer, files);
  reviewContainer.appendChild(files);

  const showTOCElement = document.querySelector('details-menu[src*=show_toc]');
  const tocUrl = showTOCElement.getAttribute('src');

  let isTreeStillLoading = true;

  fetch(tocUrl).then(r => r.text()).then((jumpToMenuFragment) => {
    let indexOfList = -1;
    let openedDivs = 0;
    for (let i = 0; i < jumpToMenuFragment.length; i++) {
      if (i !== 0 && openedDivs === 0) {
        indexOfList = i;
        break;
      }
      if (jumpToMenuFragment.substr(i, 4) === '<div') openedDivs++;
      if (jumpToMenuFragment.substr(i, 5) === '</div') openedDivs--;
    }

    // Wat???
    if (indexOfList === -1) return;

    const menuFragment = jumpToMenuFragment.substr(indexOfList);
    const parser = new DOMParser();
    const innerDocument = parser.parseFromString(menuFragment, 'text/html');

    function extractNamesAndPaths(fileName, filePath) {
      const fileNameComponents = fileName.split('→');
      if (!fileNameComponents[1]) fileNameComponents[1] = fileNameComponents[0];

      const filePathComponents = filePath.split('→');
      if (!filePathComponents[1]) filePathComponents[1] = filePathComponents[0];

      return {
        aFileName: fileNameComponents[0].trim(),
        bFileName: fileNameComponents[1].trim(),
        aFilePath: filePathComponents[0].trim(),
        bFilePath: filePathComponents[1].trim(),
      };
    }

    let lastFiles = [];

    function render() {
      const files = [];
      let missingFiles = false;

      for (const item of [...innerDocument.querySelectorAll('.select-menu-item')]) {
        const isZeroLineChange = item.querySelector('.diffstat')?.innerText?.trim() === '0';
        const wasAdded = !!item.querySelector('.octicon-diff-added');
        const wasRenamed = !!item.querySelector('.octicon-diff-renamed');
        const actualDiffNode = document.querySelector(item.getAttribute('href'));
        if (!actualDiffNode) {
          missingFiles = true;
          continue;
        }

        const viewedCheckbox = actualDiffNode.querySelector('.js-reviewed-checkbox');

        files.push({
          href: item.getAttribute('href'),
          type: item.getAttribute('data-file-type'),
          wasDeleted: item.getAttribute('data-file-deleted') === 'true',
          wasRenamed,
          wasAdded,
          isViewed: viewedCheckbox.checked,
          linesAdded: isZeroLineChange ? 0: parseInt(item.querySelector('.color-text-success').innerText, 10),
          linesDeleted: isZeroLineChange ? 0 : parseInt(item.querySelector('.color-text-danger').innerText.replace('−', '-'), 10),
          ...extractNamesAndPaths(item.querySelector('.text-emphasized').innerText.trim(), actualDiffNode.querySelector('.file-header').getAttribute('data-path').trim())
        });
      }
      if (JSON.stringify(files) === JSON.stringify(lastFiles)) return;

      const tree = { name: '/', children: [], fullPath: '' };
      for (const file of files) {
        const pathComponents = file.bFilePath.split('/');
        let current = tree;
        for (const component of pathComponents) {
          let newContainer = current.children.find(child => child.name === component);
          if (!newContainer) {
            newContainer = {
              name: component,
              fullPath: current.fullPath + '/' + component,
              children: [],
            };
            current.children.push(newContainer);
          }
          current = newContainer;
        }
        delete current.children;
        current.file = file;
      }

      function isTreeNodeCompletelyViewed(treeNode) {
        if (treeNode.children) {
          for (const child of treeNode.children) {
            if (!isTreeNodeCompletelyViewed(child)) return false;
          }
        } else {
          return treeNode.file.isViewed;
        }
        return true;
      }

      const treeRoot = document.createElement('div');
      function buildTreeDOM(rootElement, treeNode, depth = 0) {
        const newNode = document.createElement(treeNode.children ? 'details' : 'a');
        newNode.style.paddingLeft = `${depth * 8}px`;
        const nameElement = document.createElement(treeNode.children ? 'summary': 'span');
        nameElement.innerText = treeNode.name;
        newNode.appendChild(nameElement);

        if (treeNode.children) {
          // Is a folder
          const inner = document.createElement('div');
          newNode.appendChild(inner);
          newNode.classList.add('details-reset');
          if (isTreeStillLoading) {
            if (!isTreeNodeCompletelyViewed(treeNode)) {
              newNode.setAttribute('open', '1');
            }
          } else {
            const previousElem = document.querySelector(`[data-groot-path="${treeNode.fullPath}"]`);
            if (previousElem) {
              const previousOpen = previousElem.open;
              if (previousOpen) {
                newNode.setAttribute('open', '1');
                console.log('Forcing node', treeNode.fullPath, 'to be open', previousOpen);
              }
            }
          }
          newNode.setAttribute('data-groot-path', treeNode.fullPath);
          nameElement.innerText += '/';
          nameElement.prepend(htmlToNode(OPEN_DIR_ICON));
          nameElement.prepend(htmlToNode(CLOSED_DIR_ICON));
          rootElement.appendChild(newNode);
          for (const child of treeNode.children) buildTreeDOM(inner, child, depth + 1);
        } else {
          // Is a file
          let icon;
          if (treeNode.file.wasRenamed) {
            icon = htmlToNode(RENAMED_ICON);
          } else if (treeNode.file.wasDeleted) {
            icon = htmlToNode(DELETED_ICON);
          } else if (treeNode.file.wasAdded) {
            icon = htmlToNode(ADDED_ICON);
          } else {
            icon = htmlToNode(CHANGED_ICON);
          }
          newNode.prepend(icon);
          newNode.href = treeNode.file.href;
          newNode.classList.add('Link--primary-but-better', 'groot-file-link');
          const additions = document.createElement('span');
          additions.classList.add('color-text-success-but-better');
          additions.innerText = `+${treeNode.file.linesAdded}`;
          const deletions = document.createElement('span');
          deletions.classList.add('color-text-danger-but-better');
          deletions.innerText = `${treeNode.file.linesDeleted === 0 ? '-' : ''}${treeNode.file.linesDeleted}`.replace('-', '−');
          nameElement.classList.add('groot-file-name');
          if (!treeNode.file.isViewed) {
            nameElement.setAttribute('data-unviewed', '1')
          }
          additions.classList.add('groot-file-delta');
          deletions.classList.add('groot-file-delta');
          newNode.appendChild(additions);
          newNode.appendChild(deletions);
          rootElement.appendChild(newNode);
        }
      }
      buildTreeDOM(treeRoot, tree);

      let lastScrollTop = '0';
      if (treeContainer.firstChild) {
        lastScrollTop = treeContainer.firstChild.scrollTop;
        treeContainer.removeChild(treeContainer.firstChild);
      }
      treeContainer.appendChild(treeRoot.querySelector('div'));
      treeContainer.firstChild.scrollTop = lastScrollTop;
      if (missingFiles) {
        const loadingBanner = document.createElement('div');
        loadingBanner.classList.add('groot-loader');
        loadingBanner.innerText = 'Building tree...';
        loadingBanner.prepend(htmlToNode(LOADING_ICON));
        treeContainer.firstChild.prepend(loadingBanner);
        treeContainer.classList.add('loading');
      } else {
        treeContainer.classList.remove('loading');
      }
      lastFiles = files;
    }

    let lastPendingFragment = null;
    const interval = setInterval(() => {
      const pendingFragment = document.querySelector('include-fragment[src*="/diffs?"]');
      if (lastPendingFragment !== pendingFragment) render();
      lastPendingFragment = pendingFragment;
      if (!pendingFragment) {
        isTreeStillLoading = false;
        clearInterval(interval);
      }
    }, 100);
    render();

    const observer = new MutationObserver(() => render());
    observer.observe(files, {
      subtree: true,
      childList: true,
      attributes: true,
    });
    cleanupFns.push(() => observer.disconnect());
  });
}

let lastURL = null;
function maybeInit() {
  const newURL = window.location.pathname;
  if (lastURL === newURL) return;
  lastURL = newURL;
  if (/^\/[^\/]+\/[^\/]+\/pull\/[0-9]+\/files$/.test(newURL)) {
    initializePRHooks();
  }
}
maybeInit();

let debounce;
chrome.runtime.onMessage.addListener(() => {
  clearTimeout(debounce);
  debounce = setTimeout(maybeInit, 100);
});

import AdmZip from "adm-zip";
import fs from "fs-extra";
import Path from "path";
import { v4 } from "uuid";

const imageExtnames = ['.gif', '.jpg', 'jpeg', '.png', 'bmp'];

const reverseString = (s: string | undefined) => {
  return s?.split('').reverse().join('');
};

const parseArtistAndGroup = (artist: string | undefined) => {
  if (!artist) {
    return [undefined, undefined];
  }
  const matches = artist.match(/(?<first>.*?(?=( \(|$)))( \((?<second>.*?)\))?/);
  const first = matches?.groups?.first;
  const second = matches?.groups?.second;
  if (!matches || !second) {
    return [artist, undefined];
  }
  return [second, first];
};

const parseTags = (text: string | undefined) => {
  if (!text) {
    return '[]';
  }
  const tags = text.trim().split(' ').map(tag => tag.slice(1, -1));
  return JSON.stringify(tags);
};

const parseTitle = (title: string | undefined) => {
  if (!title) {
    return [undefined, undefined];
  }
  const trimmedTitle = title.trim();
  if (!trimmedTitle.includes('｜')) {
    return [trimmedTitle, trimmedTitle];
  }
  return trimmedTitle.split('｜').map(s => s.trim());
};

export const parseMangaInfo = (mangaPath: string) => {
  const fullTitle = Path.basename(mangaPath, Path.extname(mangaPath));
  const matches1 = fullTitle.match(/(\((?<event>.*?)\) )?(\[(?<artist>.*?)] )(?<rest>.*)/);
  const event = matches1?.groups?.event;
  const [artist, group] = parseArtistAndGroup(matches1?.groups?.artist);
  const rest = matches1?.groups?.rest;
  const matches2 = reverseString(rest)?.match(/(?<tags>].*\[ )?(\)(?<parody>.*)\( )?(?<title>.*)/);
  const tagsJson = parseTags(reverseString(matches2?.groups?.tags));
  const parody = reverseString(matches2?.groups?.parody);
  const [originalTitle, title] = parseTitle(reverseString(matches2?.groups?.title));
  return { title, fullTitle, originalTitle, artist, group, parody, event, tagsJson };
};

export const getMangaPaths = (mangaDir: string) => {
  const mangaPaths: string[] = [];
  const stack = [mangaDir];
  while (stack.length > 0) {
    const cwd = stack.pop();
    if (!cwd) {
      break;
    }
    fs.readdirSync(cwd).forEach((filename) => {
      const fullPath = Path.join(cwd, filename);
      try {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          stack.push(fullPath);
        } else if (Path.extname(filename) === '.zip') {
          mangaPaths.push(fullPath);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  return mangaPaths;
};

export const getImages = (path: string) => {
  const admZip = new AdmZip(path);
  return admZip.getEntries()
    .filter((entry) => !entry.isDirectory && imageExtnames.includes(Path.extname(entry.name)))
    .map((entry) => {
      const uuid = v4();
      const entryName = entry.entryName;
      const extname = Path.extname(entryName);
      const filename = `${uuid}${extname}`;
      const mangaPath = path;
      return { uuid, entryName, filename, mangaPath };
    });
};

import type { Plugin } from "vite";
import fg from "fast-glob";
import fs from "fs-extra";
interface Dirs {
  dir: string;
  dirIsPublic?: boolean;
}
interface preloadImagesOptions {
  dirs: Dirs[];
  attrs?: {
    /**
     * link rel
     * @default prefetch
     * @description  图片预加载 优先级 参数
     */
    rel?: "prefetch" | "preload";
  };
}

/**
 *
 *  @description 图片预加载插件
 * 支持多目录处理
 * 如果是public目录下的图片，则必须放在 images 目录下，需要设置dirIsPublic为true，
 * 打包时会打包到dist/assets目录下
 * public 目录下的 images 不会打包
 * dev环境下 public 目录下的会触发二次请求，暂未解决
 * 生产环境下 public 目录下的 images 文件夹下的图片不会触发二次请求
 *
 * @param options
 * }
 *
 */
const preloadImages = (options: preloadImagesOptions): Plugin => {
  const { dirs, attrs = {} } = options;
  const assetsImages: string[] = [];
  return {
    name: "vite-preload-image-prefetch", // 必须的 不能删除 删除报错  插件的名字

    // 这个是rollup 专门的钩子
    generateBundle(_, bundle) {
      console.log("bundle", bundle);
      console.log("调用的地址", process.cwd());
      // const files = []
      const fileList: string[] = [];
      // biome-ignore lint/complexity/noForEach: <explanation>
      dirs.forEach((dir) => {
        if (dir.dirIsPublic) {
          const files = fg.sync(dir.dir, {
            cwd: _.dir?.replace(/^dist\//, "public"),
          });

          // biome-ignore lint/complexity/noForEach: <explanation>
          files.forEach((file) => {
            fileList.push(file);
          });
        }
        const files = fg.sync(dir.dir);

        // biome-ignore lint/complexity/noForEach: <explanation>
        files.forEach((file) => {
          fileList.push(file);
        });
      });
      //   const files = fg.sync(dir);
      const values = Object.values(bundle);

      // biome-ignore lint/complexity/noForEach: <explanation>
      values.forEach((item) => {
        console.log(
          'Reflect.get(item, "originalFileName")',
          Reflect.get(item, "originalFileName")
        );

        const path = Reflect.get(item, "originalFileName");

        if (path && fileList.includes(path.replace(/^public\//, ""))) {
          assetsImages.push(item.fileName);
        }
      });
    },
    /** 处理index.html 文件的  接受一个参数  参数就是html字符串  这个是vite独有的钩子*/
    transformIndexHtml(_, ctx) {
      let images: string[] = [];
      console.log(
        "ctx",
        ctx.server?.config.publicDir,
        "base",
        ctx.server?.config.base
      );
      console.log("调用的地址", process.cwd());
      if (ctx.server) {
        // biome-ignore lint/style/useConst: <explanation>
        let devFileList: string[] = [];
        // biome-ignore lint/complexity/noForEach: <explanation>
        dirs.forEach((dir) => {
          if (dir.dirIsPublic) {
            const files = fg.sync(dir.dir, {
              cwd: ctx.server?.config.publicDir,
            });
            // biome-ignore lint/complexity/noForEach: <explanation>
            files.forEach((file) => {
              devFileList.push(ctx.server?.config.base + file);
            });
          } else {
            const files = fg.sync(dir.dir);
            console.log("files base", files);
            // biome-ignore lint/complexity/noForEach: <explanation>
            files.forEach((file) => {
              devFileList.push(ctx.server?.config.base + file);
            });
          }
        });
        images = devFileList;
      } else {
        images = assetsImages;
      }
      console.log("images", images);
      return images.map((href) => {
        return {
          tag: "link",
          attrs: {
            rel: attrs?.rel || "prefetch",
            as: "image",
            href: href,
          },
        };
      });
    },
    // 这个也是rollup专门的钩子  与vite 通用
    closeBundle() {
      assetsImages.length = 0;
      const distDir = "dist"; // 输出目录
      const imagesDir = `${distDir}/images`; // 要删除的目录

      if (fs.existsSync(imagesDir)) {
        fs.removeSync(imagesDir); // 删除目录及其内容
      } else {
      }
    },
  };
};

export { preloadImages };

export type { preloadImagesOptions, Dirs };

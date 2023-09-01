import os
import subprocess

class JsMinifier:
    def __init__(self, input_folder, output_folder):
        self.input_folder = input_folder
        self.output_folder = output_folder
        self._check_and_install_uglifyjs()

    def _check_and_install_uglifyjs(self):
        try:
            subprocess.run(['uglifyjs', '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except FileNotFoundError:
            print("uglify-js not found. Installing...")
            try:
                subprocess.run(['npm', 'install', '-g', 'uglify-js'], check=True, shell=True,env=os.environ)
                print("uglify-js installed successfully.")
            except subprocess.CalledProcessError:
                print("Failed to install uglify-js. Make sure npm is installed and try installing manually.")
                raise SystemExit()

    def _minify_js_file(self, input_path, output_path):
        cmd = f'uglifyjs {input_path} -o {output_path} -c -m toplevel,eval'
        subprocess.run(cmd, shell=True)
        print(input_path+"压缩完成！")

    def _minify_folder(self, folder_path):
        for root, _, files in os.walk(folder_path):
            for file in files:
                if file.endswith('.js'):
                    input_path = os.path.join(root, file)
                    output_path = os.path.join(self.output_folder, os.path.relpath(input_path, self.input_folder))
                    os.makedirs(os.path.dirname(output_path), exist_ok=True)
                    self._minify_js_file(input_path, output_path)

    def minify(self):
        self._minify_folder(self.input_folder)
        print("Minification completed.")

if __name__ == "__main__":
    input_folder = os.path.dirname(__file__)
    print(input_folder)
    output_folder = os.path.dirname(os.path.dirname(__file__))
    print(output_folder)
    minifier = JsMinifier(input_folder, output_folder)
    minifier.minify()
    input("输入任意键关闭...")

STUDY COMPANION APK SOURCE

This ZIP includes the complete app source, Capacitor configuration, package.json, and GitHub Actions APK workflow.

IMPORTANT — PDF FILES
The five supplied PDF books are large (about 286 MB combined; Engineering Mechanics alone is over 100 MB). They are not embedded in this compact source ZIP because the previous large archive could not be delivered reliably and GitHub's browser uploader has a 100 MB per-file limit.
Before building, copy these five PDFs into www/pdfs/:
- Thermodynamics.pdf
- MATERIALS & PROCESSES IN MANUFACTURING.pdf
- MATERIALS SCIENCE AND ENGINEERING.pdf
- Strength Of Material.pdf
- Engineering Mechanics.pdf

For Engineering Mechanics, use Git LFS or split it into parts and reassemble it in the GitHub workflow. If you want, I can give you the exact Git LFS steps.

UPLOAD:
1. Extract this ZIP.
2. Upload all extracted files/folders to the root of a GitHub repository.
3. Make sure .github/workflows/build-android.yml is present. If GitHub mobile uploader hides .github, create that exact file/folder in GitHub and paste the workflow.
4. Commit to main.
5. Open Actions > Build Study Companion APK > Run workflow.
6. Open successful run > Artifacts > study-companion-debug-apk. Extract it to get app-debug.apk.

APP:
Home, Analysis, Timer, Profile, Scientific Calculator.
Study records are stored locally on the device.

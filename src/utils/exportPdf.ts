import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import { ResumeData, CAREER_LABELS } from '../types/resume';

function imgToBase64(uri: string): Promise<string> {
  return FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
}

function mimeFromUri(uri: string): string {
  const ext = uri.split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
}

function formatDate(raw: string): string {
  const d = raw.replace(/\D/g, '');
  if (d.length !== 8) return raw;
  return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}`;
}

async function buildResumeHtml(data: ResumeData): Promise<string> {
  const profileB64 = data.profileImageUri
    ? await imgToBase64(data.profileImageUri)
    : null;
  const profileMime = data.profileImageUri ? mimeFromUri(data.profileImageUri) : 'image/jpeg';

  const portfolioItems = await Promise.all(
    data.portfolio.map(async p => ({
      b64: await imgToBase64(p.uri),
      mime: mimeFromUri(p.uri),
      width: p.width,
      height: p.height,
    }))
  );

  const skillTags = data.skills
    .map(s => `<span class="tag">${s}</span>`)
    .join(' ');

  const portfolioRows = () => {
    let html = '';
    for (let i = 0; i < portfolioItems.length; i += 2) {
      const a = portfolioItems[i];
      const b = portfolioItems[i + 1];
      html += `<tr>
        <td style="padding:4px;width:50%;vertical-align:top;">
          <img src="data:${a.mime};base64,${a.b64}" style="width:100%;border-radius:6px;display:block;" />
        </td>
        <td style="padding:4px;width:50%;vertical-align:top;">
          ${b ? `<img src="data:${b.mime};base64,${b.b64}" style="width:100%;border-radius:6px;display:block;" />` : ''}
        </td>
      </tr>`;
    }
    return html;
  };

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; color: #111; background: #fff; }
  .page { padding: 48px 44px; max-width: 595px; margin: 0 auto; }
  .section-label { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 8px; border-bottom: 2px solid #111; padding-bottom: 4px; display: inline-block; }
  .body-text { font-size: 17px; color: #222; line-height: 1.7; }
  .meta-text { font-size: 15px; color: #555; line-height: 1.8; }
  .tag { display: inline-block; font-size: 14px; color: #333; border: 1px solid #ddd; border-radius: 20px; padding: 3px 12px; margin: 2px 4px 2px 0; }
  hr { border: none; border-top: 1px solid #e8e8e8; margin: 18px 0; }
</style>
</head>
<body>
<div class="page">

  <!-- 헤더 -->
  <div style="display:flex;flex-direction:row;margin-bottom:4px;height:110px;">
    <div style="flex-shrink:0;margin-right:20px;">
      ${profileB64
        ? `<img src="data:${profileMime};base64,${profileB64}" style="width:110px;height:110px;border-radius:8px;object-fit:cover;display:block;" />`
        : `<div style="width:110px;height:110px;border-radius:8px;background:#f0f0f0;"></div>`}
    </div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;height:110px;">
      <div>
        <div style="font-size:10px;font-weight:600;color:#aaa;letter-spacing:2px;margin-bottom:3px;">HAIR STYLIST</div>
        <div style="font-size:28px;font-weight:800;color:#111;">${data.name}</div>
      </div>
      <div class="meta-text">
        ${data.birthDate ? `${formatDate(data.birthDate)}${data.gender ? ` &middot; ${data.gender === '여' ? '여성' : '남성'}` : ''}<br>` : ''}
        ${data.phone ? `${data.phone}<br>` : ''}
        ${data.email ? `${data.email}<br>` : ''}
        ${data.address ? data.address : ''}
      </div>
    </div>
  </div>

  <hr>

  ${data.skills.length > 0 ? `
  <div class="section-label">보유 기술</div>
  <div style="margin-bottom:4px;">${skillTags}</div>
  <hr>
  ` : ''}

  ${data.careerLevel ? `
  <div style="display:flex;justify-content:space-between;align-items:baseline;">
    <div class="section-label" style="margin-bottom:0;">경력</div>
    <div class="body-text">${CAREER_LABELS[data.careerLevel]}</div>
  </div>
  <hr>
  ` : ''}

  ${data.education || data.availableStartDate ? `
  <div style="display:flex;">
    ${data.education ? `
    <div style="flex:1;display:flex;justify-content:space-between;align-items:baseline;padding-right:16px;${data.availableStartDate ? 'border-right:1px solid #e8e8e8;' : ''}">
      <div class="section-label" style="margin-bottom:0;">학력</div>
      <div class="body-text">${data.education}</div>
    </div>` : '<div style="flex:1;"></div>'}
    ${data.availableStartDate ? `
    <div style="flex:1;display:flex;justify-content:space-between;align-items:baseline;padding-left:${data.education ? '16px' : '0'};">
      <div class="section-label" style="margin-bottom:0;">입사 가능일</div>
      <div class="body-text">${formatDate(data.availableStartDate)}</div>
    </div>` : '<div style="flex:1;"></div>'}
  </div>
  <hr>
  ` : ''}

  ${data.certifications.trim() ? `
  <div class="section-label">자격증</div>
  <div class="body-text">${data.certifications}</div>
  <hr>
  ` : ''}

  ${data.introduction.trim() ? `
  <div class="section-label">자기소개</div>
  <div class="body-text">${data.introduction}</div>
  ` : ''}

  ${portfolioItems.length > 0 ? `
  <div style="page-break-before:always;padding-top:48px;">
    <div class="section-label" style="display:block;width:100%;margin-bottom:12px;">포트폴리오</div>
    <table style="width:100%;border-collapse:collapse;">
      ${portfolioRows()}
    </table>
  </div>
  ` : ''}

</div>
</body>
</html>`;
}

export async function exportPdf(data: ResumeData): Promise<string> {
  const html = await buildResumeHtml(data);
  const dest = `${FileSystem.documentDirectory}${data.name || '이력서'}_이력서.pdf`;
  const info = await FileSystem.getInfoAsync(dest);
  if (info.exists) await FileSystem.deleteAsync(dest);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  await FileSystem.moveAsync({ from: uri, to: dest });
  return dest;
}

export async function printResume(data: ResumeData): Promise<void> {
  const html = await buildResumeHtml(data);
  await Print.printAsync({ html });
}

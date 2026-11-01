/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GenerateContentRequest, GenerateContentResult } from '../types/content';

export async function requestContentGeneration(params: GenerateContentRequest): Promise<{
  success: boolean;
  data: GenerateContentResult;
  source: string;
  error?: string;
}> {
  try {
    const response = await fetch('/api/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (err: any) {
    console.error('Client content generation call failed:', err);
    throw err;
  }
}

export async function requestSimulatedPublish(post: {
  content_id: string;
  platform: string;
  post_title: string;
  scheduled_time: string;
}): Promise<{
  success: boolean;
  platform_post_id: string;
  published_date: string;
  status: string;
  message: string;
}> {
  const response = await fetch('/api/autopost/simulate-publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(`Publish error: HTTP ${response.status}`);
  }

  return response.json();
}

export async function requestUserLogin(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(`Login failed with HTTP ${response.status}`);
  return response.json();
}

export async function requestFacebookTestConnection(pageId?: string, pageAccessToken?: string) {
  const response = await fetch('/api/facebook/test-connection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page_id: pageId, page_access_token: pageAccessToken }),
  });
  if (!response.ok) throw new Error(`Facebook test failed with HTTP ${response.status}`);
  return response.json();
}

export async function requestFacebookPublish(data: {
  page_id?: string;
  message: string;
  link?: string;
  image_url?: string;
}) {
  const response = await fetch('/api/facebook/publish-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Facebook publish failed with HTTP ${response.status}`);
  return response.json();
}

export async function requestDatabaseDiagnostics() {
  const response = await fetch('/api/database/run-diagnostics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`Database diagnostics failed with HTTP ${response.status}`);
  return response.json();
}

export async function requestSchedulerDiagnostics() {
  const response = await fetch('/api/scheduler/run-diagnostics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`Scheduler diagnostics failed with HTTP ${response.status}`);
  return response.json();
}


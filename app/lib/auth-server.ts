import "server-only";
import { NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "./firebase-admin";

export type AuthenticatedContext = {
  userId: string;
  email?: string;
  role?: string;
};

export async function authenticateRequest(
  request: Request,
): Promise<AuthenticatedContext | NextResponse> {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing authentication token." },
        { status: 401 },
      );
    }

    const idToken = authorization.slice("Bearer ".length).trim();

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing authentication token." },
        { status: 401 },
      );
    }

    const auth = getFirebaseAdminAuth();
    const decoded = await auth.verifyIdToken(idToken);

    return {
      userId: decoded.uid,
      email: decoded.email,
      role: typeof decoded.role === "string" ? decoded.role : undefined,
    };
  } catch (error) {
    console.error("Authentication verification failed:", error);
    return NextResponse.json(
      { error: "Authentication token is invalid or expired." },
      { status: 401 },
    );
  }
}

export function isAuthContext(value: unknown): value is AuthenticatedContext {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as AuthenticatedContext).userId === "string"
  );
}

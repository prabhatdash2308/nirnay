import { NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "@/app/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing Firebase ID token." },
        { status: 401 },
      );
    }

    const idToken = authorization.slice("Bearer ".length).trim();

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing Firebase ID token." },
        { status: 401 },
      );
    }

    const auth = getFirebaseAdminAuth();

    const decodedToken = await auth.verifyIdToken(idToken);

    const user = await auth.getUser(decodedToken.uid);

    const existingClaims = user.customClaims ?? {};

    const needsRoleUpdate = existingClaims.role !== "authenticated";

    if (needsRoleUpdate) {
        await auth.setCustomUserClaims(user.uid, {
            ...existingClaims,
            role: "authenticated",
        });
    }

    return NextResponse.json({
        success: true,
        role: "authenticated",
        updated: needsRoleUpdate,
    });
  } catch (error) {
    console.error("Failed to ensure Firebase authenticated role:", error);

    return NextResponse.json(
      { error: "Unable to establish authentication role." },
      { status: 401 },
    );
  }
}
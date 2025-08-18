/**
 * @openapi
 * /:
 *   get:
 *     summary: Welcome route
 *     description: Returns a welcome message from Dasvilson Server.
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Welcome to Dasvilson Server
 */

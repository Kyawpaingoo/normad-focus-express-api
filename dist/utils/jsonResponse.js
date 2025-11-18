"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
exports.icsContentResponse = icsContentResponse;
function successResponse(res, data, message = "Operation successful") {
    const responsePayload = {
        success: true,
        data,
        msg: message,
    };
    res.status(200).json(responsePayload);
}
function errorResponse(e, status, message = e.message, res) {
    const responsePayload = {
        success: false,
        error: message,
        status,
    };
    res.status(status).json(responsePayload);
}
function icsContentResponse(res, meetingId, icsContent) {
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename=meeting-${meetingId}.ics`);
    res.send(icsContent);
}
//# sourceMappingURL=jsonResponse.js.map